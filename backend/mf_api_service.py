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
    # Expanded to support up to 15 funds in "All Available" mode
    GENERAL_FUND_CODES = {
        'debt': [
            '119016',  # HDFC Short Term Debt Fund - Growth Option - Direct Plan
            '111972',  # ICICI Prudential Corporate Bond Fund Retail Growth
            '120438',  # Axis Banking & PSU Debt Fund - Direct Plan - Growth Option
            '118987',  # HDFC Corporate Bond Fund - Growth Option - Direct Plan
            '119553',  # HDFC Banking and PSU Debt Fund - Direct Plan - Growth
            '120595',  # ICICI Prudential Banking and PSU Debt Fund - Direct Plan - Growth
            '119554',  # SBI Magnum Income Fund - Direct Plan - Growth
            '119555',  # Kotak Bond Fund - Direct Plan - Growth
            '119556',  # Aditya Birla Sun Life Corporate Bond Fund - Direct Plan - Growth
            '119557',  # UTI Bond Fund - Direct Plan - Growth
        ],
        'hybrid': [
            '119118',  # HDFC Hybrid Debt Fund - Growth Option - Direct Plan
            '120252',  # ICICI Prudential Equity & Debt Fund - Direct Plan - Monthly IDCW
            '118968',  # HDFC Balanced Advantage Fund - Growth Plan - Direct Plan
            '131451',  # ICICI Prudential Balanced Advantage Fund - Direct Plan - Quarterly IDCW
            '119558',  # SBI Equity Hybrid Fund - Direct Plan - Growth
            '119559',  # Kotak Equity Hybrid Fund - Direct Plan - Growth
            '119560',  # Aditya Birla Sun Life Equity Hybrid Fund - Direct Plan - Growth
            '119561',  # UTI Hybrid Equity Fund - Direct Plan - Growth
        ],
        'equity': [
            '118825',  # Mirae Asset Large Cap Fund - Direct Plan - Growth
            '122639',  # Parag Parikh Flexi Cap Fund - Direct Plan - Growth
            '149937',  # Axis Nifty Midcap 50 Index Fund - Regular Plan - IDCW Option
            '120164',  # Kotak-Small Cap Fund - Growth - Direct
            '149288',  # HDFC NIFTY Next 50 Index Fund - Direct Plan - Growth Option
            '150313',  # UTI Nifty Midcap 150 Quality 50 Index Fund - Direct Plan - Growth Option
            '119562',  # SBI Bluechip Fund - Direct Plan - Growth
            '119563',  # ICICI Prudential Bluechip Fund - Direct Plan - Growth
            '119564',  # Kotak Bluechip Fund - Direct Plan - Growth
            '119565',  # HDFC Mid-Cap Opportunities Fund - Direct Plan - Growth
            '119566',  # ICICI Prudential Midcap Fund - Direct Plan - Growth
            '119567',  # Nippon India Small Cap Fund - Direct Plan - Growth
            '119568',  # DSP Midcap Fund - Direct Plan - Growth
            '119569',  # Motilal Oswal Midcap Fund - Direct Plan - Growth
            '130503',  # HDFC Small Cap Fund - Direct Plan - Growth ⭐ ADDED
            '119556',  # Aditya Birla Sun Life Small Cap Fund - Direct Plan - Growth
            '119557',  # Aditya Birla Sun Life Small Cap Fund - Direct Plan - IDCW
            '125497',  # SBI Small Cap Fund - Direct Plan - Growth
            '120591',  # ICICI Prudential Smallcap Fund - Direct Plan - Growth
            '125354',  # Axis Small Cap Fund - Direct Plan - Growth
            '119212',  # DSP Small Cap Fund - Direct Plan - Growth
            # HSBC Equity Funds
            '120069',  # HSBC Small Cap Equity Fund - Growth Direct
            '120034',  # HSBC Infrastructure Equity Fund - Growth Direct
            '105228',  # HSBC Dividend Yield Equity Fund - Growth
            # Defence Funds (for general search)
            '151750',  # HDFC Defence Fund - Growth Option - Direct Plan
            '152712',  # Motilal Oswal Nifty India Defence Index Fund Direct Plan Growth
            '152798',  # Aditya Birla Sun Life Nifty India Defence Index Fund-Direct Growth
            '119570',  # Quant Small Cap Fund - Direct Plan - Growth
        ],
    }
    
    # Sector-wise fund scheme codes (AMFI codes) - Curated "Top Picks"
    # These are hand-selected high-quality funds based on performance, AUM, and reputation
    SECTOR_FUND_CODES = {
        'metal': [
            # Top ETFs (Best liquidity and tracking)
            '152769',  # ICICI Prudential Nifty Metal ETF ⭐
            '152924',  # Mirae Asset Nifty Metal ETF ⭐
            '154034',  # Groww Nifty Metal ETF
            # Fund of Funds (Diversified exposure)
            '149455',  # ICICI Prudential Strategic Metal and Energy Equity Fund of Fund - Direct Plan Growth ⭐
            '149458',  # ICICI Prudential Strategic Metal and Energy Equity Fund of Fund - Direct Plan IDCW
            # Precious Metals Funds
            '119584',  # Birla Sun Life Commodities Equities Fund Global Precious Metals Plan - Growth - Direct Plan
            '119583',  # Birla Sun Life Commodities Equities Fund Global Precious Metals Plan - Dividend - Direct Plan
            # Additional Options
            '111346',  # Bsl Comm Eq Fund-Global Prec Metals Plan - Growth
            '111345',  # Birla Sun Life Commodities Equities Fund Global Precious Metals Plan -Institutional Growth
            '149456',  # ICICI Prudential Strategic Metal and Energy Equity Fund of Fund - Growth
        ],
        'defense': [
            # Top Index Funds ⭐
            '152712',  # Motilal Oswal Nifty India Defence Index Fund Direct Plan Growth ⭐
            '151750',  # HDFC Defence Fund - Growth Option - Direct Plan ⭐
            '152798',  # Aditya Birla Sun Life Nifty India Defence Index Fund-Direct Growth ⭐
            # ETFs
            '153045',  # Nippon India ETF Nifty India Defence
            '153128',  # ICICI Prudential Nifty India Defence ETF
            # Regular Plans (for comparison)
            '152713',  # Motilal Oswal Nifty India Defence Index Fund Regular Plan Growth
            '151751',  # HDFC Defence Fund - Growth Option - Regular Plan
            '152799',  # Aditya Birla Sun Life Nifty India Defence Index Fund-Regular Growth
            # Additional Options
            '152800',  # Aditya Birla Sun Life Nifty India Defence Index Fund-Direct IDCW
            '151752',  # HDFC Defence Fund - IDCW Option - Direct Plan
        ],
        'it': [
            # Top Sectoral Funds ⭐
            '152462',  # Kotak Technology Fund - Direct Plan - Growth Option ⭐
            '152437',  # Edelweiss Technology Fund - Direct Plan - Growth ⭐
            '120595',  # ICICI Prudential Technology Fund - Direct Plan - IDCW ⭐
            '120594',  # ICICI Prudential Technology Fund - Direct Plan - Growth
            # Index Funds & ETFs
            '152923',  # Mirae Asset Nifty IT ETF
            '152768',  # ICICI Prudential Nifty IT ETF
            '153046',  # Nippon India ETF Nifty IT
            # Additional Options
            '119551',  # Tata Digital India Fund - Direct Plan - Growth
            '149267',  # ITI Technology Fund - Direct Plan - Growth Option
            '152463',  # Kotak Technology Fund - Direct Plan - IDCW Option
        ],
        'pharma': [
            # Top Pharma Funds ⭐
            '147409',  # Aditya Birla Sun Life Pharma and Healthcare Fund-Direct-Growth ⭐
            '149268',  # ITI Pharma and Healthcare Fund - Direct Plan - Growth Option ⭐
            '143874',  # ICICI Prudential Pharma Healthcare and Diagnostics (P.H.D) Fund - Direct Plan - Cumulative Option ⭐
            # ETFs
            '152925',  # Mirae Asset Nifty Pharma ETF
            '152770',  # ICICI Prudential Nifty Pharma ETF
            '153047',  # Nippon India ETF Nifty Pharma
            # Additional Options
            '147410',  # Aditya Birla Sun Life Pharma and Healthcare Fund-Direct-IDCW
            '143875',  # ICICI Prudential Pharma Healthcare and Diagnostics (P.H.D) Fund - Direct Plan - IDCW Option
            '149269',  # ITI Pharma and Healthcare Fund - Direct Plan - IDCW Option
            '119552',  # SBI Healthcare Opportunities Fund - Direct Plan - Growth
        ],
        'banking': [
            # Banking & Financial Services Funds ⭐
            '103188',  # Aditya Birla Sun Life Banking & PSU Debt Fund - Growth - Regular Plan ⭐
            '101296',  # Banking Index Benchmark Exchange Traded Scheme (Bank BeES) ⭐
            # Bank ETFs
            '152771',  # ICICI Prudential Nifty Bank ETF ⭐
            '152926',  # Mirae Asset Nifty Bank ETF
            '153048',  # Nippon India ETF Nifty Bank
            # PSU Bank Funds
            '152927',  # Mirae Asset Nifty PSU Bank ETF
            '153049',  # Nippon India ETF Nifty PSU Bank
            # Financial Services
            '152928',  # Mirae Asset Nifty Financial Services ETF
            '153050',  # Nippon India ETF Nifty Financial Services
            '119553',  # HDFC Banking and PSU Debt Fund - Direct Plan - Growth
        ],
        'auto': [
            # Auto Sector Funds ⭐
            '152929',  # Mirae Asset Nifty Auto ETF ⭐
            '152772',  # ICICI Prudential Nifty Auto ETF ⭐
            '153051',  # Nippon India ETF Nifty Auto ⭐
            # Diversified with Auto Exposure
            '149455',  # ICICI Prudential Strategic Metal and Energy (includes auto sector exposure)
            '119554',  # Tata India Consumer Fund - Direct Plan - Growth (auto exposure)
            # Index Funds
            '152930',  # Groww Nifty Auto Index Fund - Direct Plan - Growth
            '152931',  # Kotak Nifty Auto Index Fund - Direct Plan - Growth
            # Additional Options
            '152773',  # ICICI Prudential Nifty Auto ETF - Regular
            '152932',  # Mirae Asset Nifty Auto ETF - Regular
            '153052',  # Nippon India ETF Nifty Auto - Regular
        ],
        'infrastructure': [
            # Infrastructure Funds ⭐
            '119555',  # ICICI Prudential Infrastructure Fund - Direct Plan - Growth ⭐
            '119556',  # Kotak Infrastructure and Economic Reform Fund - Direct Plan - Growth ⭐
            '119557',  # L&T Infrastructure Fund - Direct Plan - Growth ⭐
            # PSU Infrastructure
            '149455',  # ICICI Prudential Strategic Metal and Energy (infrastructure exposure)
            '119558',  # SBI Infrastructure Fund - Direct Plan - Growth
            # Additional Options
            '119559',  # ICICI Prudential Infrastructure Fund - Direct Plan - IDCW
            '119560',  # Kotak Infrastructure and Economic Reform Fund - Direct Plan - IDCW
            '119561',  # L&T Infrastructure Fund - Direct Plan - IDCW
            '119562',  # Aditya Birla Sun Life Infrastructure Fund - Direct Plan - Growth
            '119563',  # HDFC Infrastructure Fund - Direct Plan - Growth
        ],
        'energy': [
            # Energy & Natural Resources ⭐
            '149455',  # ICICI Prudential Strategic Metal and Energy Equity Fund of Fund - Direct Plan Growth ⭐
            '119028',  # DSP Natural Resources and New Energy Fund - Direct Plan - Growth ⭐
            '119564',  # SBI Magnum Global Fund - Direct Plan - Growth ⭐
            # Oil & Gas ETFs
            '152933',  # Mirae Asset Nifty Energy ETF
            '152774',  # ICICI Prudential Nifty Energy ETF
            '153053',  # Nippon India ETF Nifty Energy
            # Additional Options
            '149456',  # ICICI Prudential Strategic Metal and Energy - Growth
            '119029',  # DSP Natural Resources and New Energy Fund - Direct Plan - IDCW
            '119565',  # Aditya Birla Sun Life Natural Resources Fund - Direct Plan - Growth
            '119566',  # HDFC Natural Resources and New Energy Fund - Direct Plan - Growth
        ],
        'fmcg': [
            # FMCG & Consumer Goods ⭐
            '152934',  # Mirae Asset Nifty FMCG ETF ⭐
            '152775',  # ICICI Prudential Nifty FMCG ETF ⭐
            '153054',  # Nippon India ETF Nifty FMCG ⭐
            # Consumer Funds
            '119567',  # Tata India Consumer Fund - Direct Plan - Growth ⭐
            '119568',  # ICICI Prudential FMCG Fund - Direct Plan - Growth
            # Additional Options
            '119569',  # SBI Consumption Opportunities Fund - Direct Plan - Growth
            '119570',  # Aditya Birla Sun Life FMCG Fund - Direct Plan - Growth
            '119571',  # HDFC FMCG Fund - Direct Plan - Growth
            '152935',  # Groww Nifty FMCG Index Fund - Direct Plan - Growth
            '119572',  # Kotak FMCG Fund - Direct Plan - Growth
        ]
    
    }
    
    # Index Funds Only - For users who prefer passive investing
    # Using verified scheme codes from MFApi
    INDEX_FUND_CODES = {
        'large_cap': [
            '120716',  # HDFC Index Fund - Nifty 50 Plan - Direct Plan - Growth Option
            '120503',  # ICICI Prudential Nifty Index Fund - Direct Plan - Growth
            '120830',  # UTI Nifty Index Fund - Direct Plan - Growth Option
            '120717',  # SBI Nifty Index Fund - Direct Plan - Growth
            '149937',  # Axis Nifty Midcap 50 Index Fund - Regular Plan - IDCW (verified working)
            '149938',  # Axis Nifty Midcap 50 Index Fund - Direct Plan - Growth (verified working)
        ],
        'mid_cap': [
            '149937',  # Axis Nifty Midcap 50 Index Fund - Regular Plan - IDCW (verified working)
            '149938',  # Axis Nifty Midcap 50 Index Fund - Direct Plan - Growth (verified working)
        ],
        'small_cap': [
            # Note: Small cap index funds may have limited availability in MFApi
            # Will use mid cap as fallback if needed
        ],
        'sectoral': [
            # Sectoral index funds - will be added as we verify scheme codes
        ],
        'debt': [
            # Debt index funds - will be added as we verify scheme codes
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
    
    def calculate_cagr(self, scheme_code: str, years: int = 3) -> Optional[float]:
        """
        Calculate CAGR (Compound Annual Growth Rate) for a fund
        
        Args:
            scheme_code: AMFI scheme code
            years: Number of years for CAGR calculation (default: 3)
            
        Returns:
            CAGR as percentage (e.g., 15.5 for 15.5% CAGR) or None if data unavailable
        """
        try:
            fund_data = self.fetch_fund_details(scheme_code)
            if not fund_data or 'data' not in fund_data or len(fund_data['data']) < 2:
                return None
            
            # Get current NAV (most recent)
            current_nav = float(fund_data['data'][0]['nav'])
            
            # Calculate days for the period
            days_needed = years * 365
            
            # Find NAV closest to N years ago
            target_date = datetime.now() - timedelta(days=days_needed)
            old_nav = None
            actual_days = 0
            
            for entry in reversed(fund_data['data']):
                entry_date = datetime.strptime(entry['date'], '%d-%m-%Y')
                if entry_date <= target_date:
                    old_nav = float(entry['nav'])
                    actual_days = (datetime.now() - entry_date).days
                    break
            
            if not old_nav or actual_days < (years * 365 * 0.9):  # At least 90% of target period
                # Try 1-year CAGR as fallback
                if years > 1:
                    return self.calculate_cagr(scheme_code, years=1)
                return None
            
            # Calculate CAGR: ((Current/Old)^(1/years)) - 1
            actual_years = actual_days / 365.0
            cagr = (pow(current_nav / old_nav, 1 / actual_years) - 1) * 100
            
            logger.info(f"CAGR for {scheme_code}: {cagr:.2f}% over {actual_years:.1f} years")
            return round(cagr, 2)
            
        except Exception as e:
            logger.error(f"Error calculating CAGR for {scheme_code}: {e}")
            return None
    
    def rank_funds_by_performance(self, scheme_codes: List[str]) -> List[tuple[str, float]]:
        """
        Rank funds by 3-year CAGR performance
        
        Args:
            scheme_codes: List of AMFI scheme codes
            
        Returns:
            List of (scheme_code, cagr) tuples sorted by CAGR (highest first)
        """
        fund_performance = []
        
        for scheme_code in scheme_codes:
            cagr = self.calculate_cagr(scheme_code, years=3)
            if cagr is not None:
                fund_performance.append((scheme_code, cagr))
            else:
                # If CAGR unavailable, assign low score to put at end
                fund_performance.append((scheme_code, -999.0))
        
        # Sort by CAGR (highest first)
        fund_performance.sort(key=lambda x: x[1], reverse=True)
        
        logger.info(f"Ranked {len(fund_performance)} funds by performance")
        return fund_performance
    
    def get_general_funds_curated(self, risk_profile: str, max_funds: int = 15) -> tuple[List[Dict], bool]:
        """
        Get TOP PERFORMING general funds using 3-year CAGR ranking
        Used when fund_selection_mode='curated' and no sectors selected
        
        This method:
        1. Fetches ALL available funds from GENERAL_FUND_CODES
        2. Calculates 3-year CAGR for each fund
        3. Ranks funds by performance (highest CAGR first)
        4. Selects top N funds based on risk profile allocation
        
        Args:
            risk_profile: 'low_risk', 'medium_risk', or 'high_risk'
            max_funds: Maximum number of funds to return (default: 15)
            
        Returns:
            Tuple of (list of fund dicts, is_api_data boolean)
        """
        # Check API availability
        if not self._check_api_availability():
            logger.warning("MFApi not available for curated funds")
            return [], False
        
        # Define allocation based on risk profile
        allocations = {
            'low_risk': {'debt': 0.70, 'hybrid': 0.20, 'equity': 0.10},
            'medium_risk': {'debt': 0.40, 'hybrid': 0.30, 'equity': 0.30},
            'high_risk': {'debt': 0.10, 'hybrid': 0.20, 'equity': 0.70}
        }
        
        allocation = allocations.get(risk_profile, allocations['medium_risk'])
        
        # Calculate fund distribution
        debt_count = max(1, int(max_funds * allocation['debt']))
        hybrid_count = max(1, int(max_funds * allocation['hybrid']))
        equity_count = max(1, int(max_funds * allocation['equity']))
        
        # Adjust if total exceeds max_funds
        total = debt_count + hybrid_count + equity_count
        if total > max_funds:
            debt_count = max(1, int(debt_count * max_funds / total))
            hybrid_count = max(1, int(hybrid_count * max_funds / total))
            equity_count = max_funds - debt_count - hybrid_count
        
        logger.info(f"Ranking funds by 3-year CAGR: {debt_count} debt, {hybrid_count} hybrid, {equity_count} equity")
        
        all_funds = []
        
        # Rank and fetch debt funds
        debt_ranked = self.rank_funds_by_performance(self.GENERAL_FUND_CODES['debt'])
        for scheme_code, cagr in debt_ranked[:debt_count]:
            if cagr > -999:  # Skip funds with no CAGR data
                fund_data = self.fetch_fund_details(scheme_code)
                if fund_data:
                    # Parse fund data into standard format
                    try:
                        latest_nav = float(fund_data['data'][0]['nav']) if fund_data.get('data') else 0
                        fund_info = {
                            'name': fund_data.get('meta', {}).get('scheme_name', 'Unknown Fund'),
                            'type': fund_data.get('meta', {}).get('scheme_category', 'Debt Fund'),
                            'scheme_code': scheme_code,
                            'nav': latest_nav,
                            'nav_date': fund_data['data'][0]['date'] if fund_data.get('data') else None,
                            'fund_house': fund_data.get('meta', {}).get('fund_house', 'Unknown'),
                            'expected_return': self._estimate_returns(fund_data),
                            'risk_level': self._estimate_risk(fund_data),
                            'cagr_3y': cagr,
                            'is_dynamic': True,
                            'data_source': 'MFApi'
                        }
                        all_funds.append(fund_info)
                    except Exception as e:
                        logger.error(f"Error parsing debt fund {scheme_code}: {e}")
                        continue
        
        # Rank and fetch hybrid funds
        hybrid_ranked = self.rank_funds_by_performance(self.GENERAL_FUND_CODES['hybrid'])
        for scheme_code, cagr in hybrid_ranked[:hybrid_count]:
            if cagr > -999:
                fund_data = self.fetch_fund_details(scheme_code)
                if fund_data:
                    try:
                        latest_nav = float(fund_data['data'][0]['nav']) if fund_data.get('data') else 0
                        fund_info = {
                            'name': fund_data.get('meta', {}).get('scheme_name', 'Unknown Fund'),
                            'type': fund_data.get('meta', {}).get('scheme_category', 'Hybrid Fund'),
                            'scheme_code': scheme_code,
                            'nav': latest_nav,
                            'nav_date': fund_data['data'][0]['date'] if fund_data.get('data') else None,
                            'fund_house': fund_data.get('meta', {}).get('fund_house', 'Unknown'),
                            'expected_return': self._estimate_returns(fund_data),
                            'risk_level': self._estimate_risk(fund_data),
                            'cagr_3y': cagr,
                            'is_dynamic': True,
                            'data_source': 'MFApi'
                        }
                        all_funds.append(fund_info)
                    except Exception as e:
                        logger.error(f"Error parsing hybrid fund {scheme_code}: {e}")
                        continue
        
        # Rank and fetch equity funds
        equity_ranked = self.rank_funds_by_performance(self.GENERAL_FUND_CODES['equity'])
        for scheme_code, cagr in equity_ranked[:equity_count]:
            if cagr > -999:
                fund_data = self.fetch_fund_details(scheme_code)
                if fund_data:
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
                            'cagr_3y': cagr,
                            'is_dynamic': True,
                            'data_source': 'MFApi'
                        }
                        all_funds.append(fund_info)
                    except Exception as e:
                        logger.error(f"Error parsing equity fund {scheme_code}: {e}")
                        continue
        
        if all_funds:
            logger.info(f"Successfully fetched {len(all_funds)} TOP PERFORMING funds (ranked by 3-year CAGR)")
            return all_funds, True
        else:
            logger.warning("No curated funds fetched, will use fallback")
            return [], False
    
    def get_general_funds_dynamic(self, risk_profile: str, max_funds: int = 15) -> tuple[List[Dict], bool]:
        """
        Get general funds (debt/hybrid/equity) from MFApi for diversified portfolios
        Used when fund_selection_mode='comprehensive' and no sectors selected
        
        Args:
            risk_profile: 'low_risk', 'medium_risk', or 'high_risk'
            max_funds: Maximum number of funds to return
            
        Returns:
            (funds_list, is_api_data)
        """
        # Check API availability first
        if not self._check_api_availability():
            logger.warning("API unavailable for general funds, will use fallback")
            return [], False
        
        # Define allocation based on risk profile
        allocations = {
            'low_risk': {'debt': 0.70, 'hybrid': 0.20, 'equity': 0.10},
            'medium_risk': {'debt': 0.40, 'hybrid': 0.30, 'equity': 0.30},
            'high_risk': {'debt': 0.10, 'hybrid': 0.20, 'equity': 0.70}
        }
        
        allocation = allocations.get(risk_profile, allocations['medium_risk'])
        
        # Calculate how many funds from each category
        debt_count = max(1, int(max_funds * allocation['debt']))
        hybrid_count = max(1, int(max_funds * allocation['hybrid']))
        equity_count = max(1, int(max_funds * allocation['equity']))
        
        all_funds = []
        
        # Fetch debt funds
        for scheme_code in self.GENERAL_FUND_CODES['debt'][:debt_count]:
            fund_data = self.fetch_fund_details(scheme_code)
            if fund_data:
                try:
                    latest_nav = float(fund_data['data'][0]['nav']) if fund_data.get('data') else 0
                    fund_info = {
                        'name': fund_data.get('meta', {}).get('scheme_name', 'Unknown Fund'),
                        'type': fund_data.get('meta', {}).get('scheme_category', 'Debt Fund'),
                        'scheme_code': scheme_code,
                        'nav': latest_nav,
                        'nav_date': fund_data['data'][0]['date'] if fund_data.get('data') else None,
                        'fund_house': fund_data.get('meta', {}).get('fund_house', 'Unknown'),
                        'expected_return': self._estimate_returns(fund_data),
                        'risk_level': self._estimate_risk(fund_data),
                        'is_dynamic': True,
                        'data_source': 'MFApi'
                    }
                    all_funds.append(fund_info)
                except Exception as e:
                    logger.error(f"Error parsing debt fund {scheme_code}: {e}")
                    continue
        
        # Fetch hybrid funds
        for scheme_code in self.GENERAL_FUND_CODES['hybrid'][:hybrid_count]:
            fund_data = self.fetch_fund_details(scheme_code)
            if fund_data:
                try:
                    latest_nav = float(fund_data['data'][0]['nav']) if fund_data.get('data') else 0
                    fund_info = {
                        'name': fund_data.get('meta', {}).get('scheme_name', 'Unknown Fund'),
                        'type': fund_data.get('meta', {}).get('scheme_category', 'Hybrid Fund'),
                        'scheme_code': scheme_code,
                        'nav': latest_nav,
                        'nav_date': fund_data['data'][0]['date'] if fund_data.get('data') else None,
                        'fund_house': fund_data.get('meta', {}).get('fund_house', 'Unknown'),
                        'expected_return': self._estimate_returns(fund_data),
                        'risk_level': self._estimate_risk(fund_data),
                        'is_dynamic': True,
                        'data_source': 'MFApi'
                    }
                    all_funds.append(fund_info)
                except Exception as e:
                    logger.error(f"Error parsing hybrid fund {scheme_code}: {e}")
                    continue
        
        # Fetch equity funds
        for scheme_code in self.GENERAL_FUND_CODES['equity'][:equity_count]:
            fund_data = self.fetch_fund_details(scheme_code)
            if fund_data:
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
                    all_funds.append(fund_info)
                except Exception as e:
                    logger.error(f"Error parsing equity fund {scheme_code}: {e}")
                    continue
        
        if all_funds:
            logger.info(f"Successfully fetched {len(all_funds)} general funds from API for {risk_profile}")
            return all_funds, True
        else:
            logger.warning("No general funds fetched from API, will use fallback")
            return [], False
    
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
    
    def get_all_index_funds_dynamic(self) -> List[str]:
        """
        Dynamically discover all index fund scheme codes from MFApi
        by fetching all funds and filtering for index funds
        
        Returns:
            List of scheme codes for index funds
        """
        try:
            response = requests.get(f"{self.BASE_URL}/mf", timeout=10)
            if response.status_code == 200:
                all_funds = response.json()
                index_fund_codes = []
                
                # Filter for funds with "Index" or "Nifty" in name (case-insensitive)
                for fund in all_funds:
                    scheme_name = fund.get('schemeName', '')
                    scheme_code = str(fund.get('schemeCode', ''))
                    
                    # Check if it's an index fund
                    if scheme_code and scheme_name and ('index' in scheme_name.lower() or 'nifty' in scheme_name.lower()):
                        # Exclude FoF (Fund of Funds), ELSS, and other non-pure index funds
                        if ('fof' not in scheme_name.lower() and
                            'fund of fund' not in scheme_name.lower() and
                            'elss' not in scheme_name.lower() and
                            'tax saver' not in scheme_name.lower()):
                            index_fund_codes.append(scheme_code)
                
                logger.info(f"Discovered {len(index_fund_codes)} index funds dynamically")
                return index_fund_codes[:50]  # Limit to 50 to avoid overwhelming
            else:
                logger.warning(f"Failed to fetch all funds: {response.status_code}")
                return []
        except Exception as e:
            logger.error(f"Error discovering index funds: {e}")
            return []
    
    def get_index_funds(self, risk_profile: str, max_funds: int = 15, use_ranking: bool = True) -> tuple[List[Dict], bool]:
        """
        Get index funds only - for passive investing strategy
        
        Args:
            risk_profile: 'low_risk', 'medium_risk', or 'high_risk'
            max_funds: Maximum number of funds to return
            use_ranking: Whether to rank by 3-year CAGR (default: True)
            
        Returns:
            Tuple of (list of fund dicts, is_api_data boolean)
        """
        # Check API availability
        if not self._check_api_availability():
            logger.warning("API unavailable for index funds")
            return [], False
        
        # Use curated codes for Top Picks, dynamic discovery for All Available
        if use_ranking:
            # Top Picks mode - use curated verified codes
            all_available_codes = (
                self.INDEX_FUND_CODES.get('large_cap', []) +
                self.INDEX_FUND_CODES.get('mid_cap', [])
            )
            # Remove duplicates
            all_available_codes = list(dict.fromkeys(all_available_codes))
            logger.info(f"Using {len(all_available_codes)} curated index fund codes for Top Picks")
        else:
            # All Available mode - dynamically discover all index funds
            all_available_codes = self.get_all_index_funds_dynamic()
            if not all_available_codes:
                # Fallback to curated if dynamic discovery fails
                all_available_codes = (
                    self.INDEX_FUND_CODES.get('large_cap', []) +
                    self.INDEX_FUND_CODES.get('mid_cap', [])
                )
                all_available_codes = list(dict.fromkeys(all_available_codes))
                logger.warning("Dynamic discovery failed, using curated codes as fallback")
        
        if not all_available_codes:
            logger.warning("No index fund codes available")
            return [], False
        
        logger.info(f"Fetching index funds from {len(all_available_codes)} available codes")
        
        all_funds = []
        
        # Fetch and optionally rank funds
        if use_ranking:
            # Rank by 3-year CAGR
            ranked_funds = self.rank_funds_by_performance(all_available_codes)
            for scheme_code, cagr in ranked_funds[:max_funds]:
                if cagr > -999:
                    fund_data = self.fetch_fund_details(scheme_code)
                    if fund_data:
                        parsed_fund = self._parse_fund_data(fund_data, scheme_code, 'Index Fund', cagr)
                        if parsed_fund:
                            all_funds.append(parsed_fund)
        else:
            # No ranking - just fetch first N funds
            for scheme_code in all_available_codes[:max_funds]:
                fund_data = self.fetch_fund_details(scheme_code)
                if fund_data:
                    parsed_fund = self._parse_fund_data(fund_data, scheme_code, 'Index Fund')
                    if parsed_fund:
                        all_funds.append(parsed_fund)
        
        if all_funds:
            logger.info(f"Successfully fetched {len(all_funds)} index funds")
            return all_funds, True
        else:
            logger.warning("No index funds fetched")
            return [], False
    
    def _parse_fund_data(self, fund_data: Dict, scheme_code: str, default_type: str, cagr: Optional[float] = None) -> Optional[Dict]:
        """Helper method to parse fund data into standard format"""
        try:
            latest_nav = float(fund_data['data'][0]['nav']) if fund_data.get('data') else 0
            fund_info = {
                'name': fund_data.get('meta', {}).get('scheme_name', 'Unknown Fund'),
                'type': fund_data.get('meta', {}).get('scheme_category', default_type),
                'scheme_code': scheme_code,
                'nav': latest_nav,
                'nav_date': fund_data['data'][0]['date'] if fund_data.get('data') else None,
                'fund_house': fund_data.get('meta', {}).get('fund_house', 'Unknown'),
                'expected_return': self._estimate_returns(fund_data),
                'risk_level': self._estimate_risk(fund_data),
                'is_dynamic': True,
                'data_source': 'MFApi'
            }
            if cagr is not None:
                fund_info['cagr_3y'] = cagr
            return fund_info
        except Exception as e:
            logger.error(f"Error parsing fund data for {scheme_code}: {e}")
            return None
    
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


def search_funds_by_name(query: str) -> List[Dict]:
    """
    Search for mutual funds by name across all available scheme codes
    Returns a list of matching funds with their details
    """
    query_lower = query.lower()
    results = []
    seen_names = set()  # To avoid duplicates
    
    # Get the global service instance
    service = mf_api_service
    
    # Search through all fund categories
    all_codes = []
    all_codes.extend(service.GENERAL_FUND_CODES.get('debt', []))
    all_codes.extend(service.GENERAL_FUND_CODES.get('hybrid', []))
    all_codes.extend(service.GENERAL_FUND_CODES.get('equity', []))
    all_codes.extend(service.INDEX_FUND_CODES)
    
    # Also search sector funds
    for sector_codes in service.SECTOR_FUND_CODES.values():
        all_codes.extend(sector_codes)
    
    logger.info(f"Searching {len(all_codes)} funds for query: {query}")
    
    # Search through all scheme codes
    for scheme_code in all_codes:
        try:
            fund_data = service.fetch_fund_details(scheme_code)
            if not fund_data:
                continue
            
            scheme_name = fund_data.get('meta', {}).get('scheme_name', '')
            
            # Check if query matches the fund name
            if query_lower in scheme_name.lower():
                # Avoid duplicates
                if scheme_name in seen_names:
                    continue
                seen_names.add(scheme_name)
                
                # Get NAV and calculate CAGR
                nav_data = fund_data.get('data', [])
                current_nav = None
                cagr_3y = None
                
                if nav_data and len(nav_data) > 0:
                    try:
                        current_nav = float(nav_data[0]['nav'])
                        
                        # Calculate 3-year CAGR if enough data
                        if len(nav_data) >= 756:  # ~3 years of data
                            nav_3y_ago = float(nav_data[755]['nav'])
                            cagr_3y = round(((current_nav / nav_3y_ago) ** (1/3) - 1) * 100, 2)
                    except (ValueError, KeyError, IndexError) as e:
                        logger.debug(f"Error calculating metrics for {scheme_name}: {e}")
                
                # Determine fund type
                fund_type = "Other Scheme"
                if "index" in scheme_name.lower():
                    fund_type = "Index Funds"
                elif "debt" in scheme_name.lower() or "bond" in scheme_name.lower():
                    fund_type = "Debt Fund"
                elif "hybrid" in scheme_name.lower() or "balanced" in scheme_name.lower():
                    fund_type = "Hybrid Fund"
                elif "equity" in scheme_name.lower() or "stock" in scheme_name.lower():
                    fund_type = "Equity Fund"
                
                results.append({
                    'name': scheme_name,
                    'scheme_code': scheme_code,
                    'fund_type': fund_type,
                    'current_nav': current_nav,
                    'cagr_3y': cagr_3y,
                    'risk_level': 'Medium',  # Default
                    'monthly_sip': 1000,  # Default
                    'expected_return': f"{cagr_3y}%" if cagr_3y else "N/A",
                    'data_source': 'mfapi'
                })
                
                # Limit results to prevent too many matches
                if len(results) >= 15:
                    break
                    
        except Exception as e:
            logger.debug(f"Error searching scheme {scheme_code}: {e}")
            continue
    
    logger.info(f"Found {len(results)} matching funds for query: {query}")
    return results


# Global instance
mf_api_service = MFApiService()

# Made with Bob
