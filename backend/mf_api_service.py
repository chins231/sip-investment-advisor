"""
Mutual Fund API Service - Fetches live fund data with fallback to static data
Uses MFApi (https://api.mfapi.in/) for real-time Indian mutual fund data
"""

import requests
from typing import List, Dict, Optional
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class MFApiService:
    """Service to fetch mutual fund data from MFApi with caching and fallback"""
    
    BASE_URL = "https://api.mfapi.in"
    CACHE_DURATION = timedelta(hours=6)  # Cache data for 6 hours
    
    # General/Non-Sector fund scheme codes (for low/medium/high risk profiles)
    GENERAL_FUND_CODES = {
        'debt': [
            '119016',  # HDFC Short Term Debt Fund - Growth Option - Direct Plan
            '111972',  # ICICI Prudential Corporate Bond Fund Retail Growth
            '120438',  # Axis Banking & PSU Debt Fund - Direct Plan - Growth Option
        ],
        'hybrid': [
            '119118',  # HDFC Hybrid Debt Fund - Growth Option - Direct Plan
            '120252',  # ICICI Prudential Equity & Debt Fund - Direct Plan - Monthly IDCW
        ],
    }
    
    # Sector-wise fund scheme codes (AMFI codes) - All Direct Plan Growth options
    SECTOR_FUND_CODES = {
        'metal': [
            '152769',  # ICICI Prudential Nifty Metal ETF
            '149455',  # ICICI Prudential Strategic Metal and Energy Equity Fund of Fund - Direct Plan Growth
            '152924',  # Mirae Asset Nifty Metal ETF
        ],
        'defense': [
            '152712',  # Motilal Oswal Nifty India Defence Index Fund Direct Plan Growth
            '151750',  # HDFC Defence Fund - Growth Option - Direct Plan
            '152798',  # Aditya Birla Sun Life Nifty India Defence Index Fund-Direct Growth
        ],
        'it': [
            '152462',  # Kotak Technology Fund - Direct Plan - Growth Option
            '152437',  # Edelweiss Technology Fund - Direct Plan - Growth
            '120595',  # ICICI Prudential Technology Fund - Direct Plan - IDCW
        ],
        'pharma': [
            '147409',  # Aditya Birla Sun Life Pharma and Healthcare Fund-Direct-Growth
            '149268',  # ITI Pharma and Healthcare Fund - Direct Plan - Growth Option
            '143874',  # ICICI Prudential Pharma Healthcare and Diagnostics (P.H.D) Fund - Direct Plan - Cumulative Option
        ],
        'banking': [
            '103188',  # Aditya Birla Sun Life Banking & PSU Debt Fund - Growth - Regular Plan
            '101296',  # Banking Index Benchmark Exchange Traded Scheme (Bank BeES)
        ],
        'auto': [
            '149455',  # ICICI Prudential Strategic Metal and Energy (includes auto sector exposure)
        ],
        'infrastructure': [
            '149455',  # ICICI Prudential Strategic Metal and Energy (infrastructure exposure)
        ],
        'energy': [
            '149455',  # ICICI Prudential Strategic Metal and Energy Equity Fund of Fund - Direct Plan Growth
            '119028',  # DSP Natural Resources and New Energy Fund - Direct Plan - Growth
        ],
        'fmcg': [
            '149455',  # ICICI Prudential Strategic Metal and Energy (diversified exposure)
        ]
    }
    
    def __init__(self):
        self.cache = {}
        self.last_fetch = {}
        self.api_available = True
        self.last_api_check = None
    
    def _is_cache_valid(self, key: str) -> bool:
        """Check if cached data is still valid"""
        if key not in self.cache or key not in self.last_fetch:
            return False
        return datetime.now() - self.last_fetch[key] < self.CACHE_DURATION
    
    def _check_api_availability(self) -> bool:
        """Check if API is available"""
        # Check every 5 minutes
        if self.last_api_check and datetime.now() - self.last_api_check < timedelta(minutes=5):
            return self.api_available
        
        try:
            response = requests.get(f"{self.BASE_URL}/mf", timeout=5)
            self.api_available = response.status_code == 200
            self.last_api_check = datetime.now()
            return self.api_available
        except Exception as e:
            logger.warning(f"API availability check failed: {e}")
            self.api_available = False
            self.last_api_check = datetime.now()
            return False
    
    def fetch_fund_details(self, scheme_code: str) -> Optional[Dict]:
        """Fetch fund details from API"""
        cache_key = f"fund_{scheme_code}"
        
        # Return cached data if valid
        if self._is_cache_valid(cache_key):
            logger.info(f"Returning cached data for scheme {scheme_code}")
            return self.cache[cache_key]
        
        try:
            response = requests.get(f"{self.BASE_URL}/mf/{scheme_code}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.cache[cache_key] = data
                self.last_fetch[cache_key] = datetime.now()
                logger.info(f"Fetched fresh data for scheme {scheme_code}")
                return data
            else:
                logger.warning(f"API returned status {response.status_code} for scheme {scheme_code}")
                return None
        except Exception as e:
            logger.error(f"Error fetching fund {scheme_code}: {e}")
            return None
    
    def get_sector_funds_dynamic(self, sector: str) -> List[Dict]:
        """Get funds for a sector from API"""
        if sector not in self.SECTOR_FUND_CODES:
            return []
        
        funds = []
        for scheme_code in self.SECTOR_FUND_CODES[sector]:
            fund_data = self.fetch_fund_details(scheme_code)
            if fund_data:
                # Parse and format fund data
                try:
                    latest_nav = float(fund_data['data'][0]['nav']) if fund_data.get('data') else 0
                    fund_info = {
                        'name': fund_data.get('meta', {}).get('scheme_name', 'Unknown Fund'),
                        'type': fund_data.get('meta', {}).get('scheme_category', 'Equity Fund'),
                        'scheme_code': scheme_code,
                        'nav': latest_nav,
                        'nav_date': fund_data['data'][0]['date'] if fund_data.get('data') else None,
                        'fund_house': fund_data.get('meta', {}).get('fund_house', 'Unknown'),
                        'expected_return': self._estimate_returns(fund_data),
                        'risk_level': self._estimate_risk(fund_data),
                        'is_dynamic': True,
                        'data_source': 'MFApi'
                    }
                    funds.append(fund_info)
                except Exception as e:
                    logger.error(f"Error parsing fund data for {scheme_code}: {e}")
                    continue
        
        return funds
    
    def _estimate_returns(self, fund_data: Dict) -> float:
        """Estimate expected returns based on historical NAV data"""
        try:
            if not fund_data.get('data') or len(fund_data['data']) < 365:
                return 12.0  # Default return
            
            # Calculate 1-year return
            current_nav = float(fund_data['data'][0]['nav'])
            year_ago_nav = float(fund_data['data'][min(365, len(fund_data['data'])-1)]['nav'])
            
            if year_ago_nav > 0:
                return_pct = ((current_nav - year_ago_nav) / year_ago_nav) * 100
                return round(return_pct, 2)
            return 12.0
        except Exception as e:
            logger.error(f"Error calculating returns: {e}")
            return 12.0
    
    def _estimate_risk(self, fund_data: Dict) -> str:
        """Estimate risk level based on fund category and volatility"""
        try:
            category = fund_data.get('meta', {}).get('scheme_category', '').lower()
            
            if 'debt' in category or 'liquid' in category:
                return 'Low'
            elif 'hybrid' in category or 'balanced' in category:
                return 'Medium'
            elif 'large cap' in category or 'bluechip' in category:
                return 'Medium-High'
            elif 'mid cap' in category or 'small cap' in category:
                return 'High'
            elif 'sectoral' in category or 'thematic' in category:
                return 'Very High'
            else:
                return 'Medium'
        except Exception as e:
            logger.error(f"Error estimating risk: {e}")
            return 'Medium'
    
    def get_all_funds_for_sectors(self, sectors: List[str]) -> tuple[List[Dict], bool]:
        """
        Get funds for multiple sectors with deduplication
        Returns: (funds_list, is_api_data)
        """
        # Check API availability first
        if not self._check_api_availability():
            logger.warning("API unavailable, will use fallback data")
            return [], False
        
        all_funds = []
        seen_scheme_codes = set()
        
        for sector in sectors:
            sector_funds = self.get_sector_funds_dynamic(sector)
            # Deduplicate by scheme_code
            for fund in sector_funds:
                scheme_code = fund.get('scheme_code')
                if scheme_code and scheme_code not in seen_scheme_codes:
                    seen_scheme_codes.add(scheme_code)
                    all_funds.append(fund)
                elif not scheme_code:
                    # If no scheme_code, add anyway (shouldn't happen with API data)
                    all_funds.append(fund)
        
        if all_funds:
            logger.info(f"Successfully fetched {len(all_funds)} unique funds from API (deduplicated)")
            return all_funds, True
        else:
            logger.warning("No funds fetched from API, will use fallback")
            return [], False
    def get_nav_by_fund_name(self, fund_name: str) -> Optional[float]:
        """
        Get NAV for a fund by searching through all sector funds
        Returns NAV if found, None otherwise
        """
        # Search through all cached funds first
        for cache_key, cached_data in self.cache.items():
            if cache_key.startswith('fund_'):
                try:
                    cached_name = cached_data.get('meta', {}).get('scheme_name', '')
                    if cached_name and fund_name.lower() in cached_name.lower():
                        latest_nav = float(cached_data['data'][0]['nav']) if cached_data.get('data') else None
                        if latest_nav:
                            logger.info(f"Found NAV {latest_nav} for {fund_name} in cache")
                            return latest_nav
                except Exception as e:
                    logger.debug(f"Error checking cached fund: {e}")
                    continue
        
        # If not in cache, search through general funds first (debt/hybrid)
        for general_codes in self.GENERAL_FUND_CODES.values():
            for scheme_code in general_codes:
                fund_data = self.fetch_fund_details(scheme_code)
                if fund_data:
                    try:
                        scheme_name = fund_data.get('meta', {}).get('scheme_name', '')
                        if scheme_name and fund_name.lower() in scheme_name.lower():
                            latest_nav = float(fund_data['data'][0]['nav']) if fund_data.get('data') else None
                            if latest_nav:
                                logger.info(f"Found NAV {latest_nav} for {fund_name} via general funds API search")
                                return latest_nav
                    except Exception as e:
                        logger.debug(f"Error parsing general fund data: {e}")
                        continue
        
        # If not found in general funds, search through sector funds
        for sector_codes in self.SECTOR_FUND_CODES.values():
            for scheme_code in sector_codes:
                fund_data = self.fetch_fund_details(scheme_code)
                if fund_data:
                    try:
                        scheme_name = fund_data.get('meta', {}).get('scheme_name', '')
                        if scheme_name and fund_name.lower() in scheme_name.lower():
                            latest_nav = float(fund_data['data'][0]['nav']) if fund_data.get('data') else None
                            if latest_nav:
                                logger.info(f"Found NAV {latest_nav} for {fund_name} via sector funds API search")
                                return latest_nav
                    except Exception as e:
                        logger.debug(f"Error parsing sector fund data: {e}")
                        continue
        
        logger.warning(f"Could not find NAV for fund: {fund_name}")
        return None


# Global instance
mf_api_service = MFApiService()

# Made with Bob
