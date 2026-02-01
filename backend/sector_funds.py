"""
Sector-specific mutual funds and ETFs with portfolio holdings information
"""

SECTOR_FUNDS = {
    'metal': {
        'name': 'Metal & Mining',
        'funds': [
            {
                'name': 'Nippon India ETF Metal',
                'type': 'ETF',
                'expected_return': 18.0,
                'risk_level': 'Very High',
                'holdings_url': 'https://mf.nipponindiaim.com/FundsAndPerformance/Pages/Nippon-India-ETF-Nifty-Metal.aspx',
                'top_holdings': [
                    {'company': 'Tata Steel', 'percentage': 22.5},
                    {'company': 'Hindalco Industries', 'percentage': 18.3},
                    {'company': 'JSW Steel', 'percentage': 15.7},
                    {'company': 'Coal India', 'percentage': 12.4},
                    {'company': 'Vedanta', 'percentage': 10.8}
                ],
                'description': 'Invests in metal and mining companies including steel, aluminum, copper, and coal sectors'
            },
            {
                'name': 'SBI PSU Fund',
                'type': 'Equity Fund',
                'expected_return': 16.5,
                'risk_level': 'High',
                'holdings_url': 'https://www.sbimf.com/en-us/individual/our-funds/equity-funds/sbi-psu-fund',
                'top_holdings': [
                    {'company': 'NTPC', 'percentage': 8.5},
                    {'company': 'Coal India', 'percentage': 7.8},
                    {'company': 'Power Grid', 'percentage': 7.2},
                    {'company': 'ONGC', 'percentage': 6.9},
                    {'company': 'Indian Oil', 'percentage': 6.5}
                ],
                'description': 'Focuses on Public Sector Undertakings including metal PSUs'
            }
        ]
    },
    'defense': {
        'name': 'Defense & Aerospace',
        'funds': [
            {
                'name': 'Motilal Oswal Nifty India Defence Index Fund',
                'type': 'Index Fund',
                'expected_return': 20.0,
                'risk_level': 'Very High',
                'holdings_url': 'https://www.motilaloswalmf.com/mf/nifty-india-defence-index-fund',
                'top_holdings': [
                    {'company': 'Hindustan Aeronautics (HAL)', 'percentage': 25.3},
                    {'company': 'Bharat Electronics (BEL)', 'percentage': 22.7},
                    {'company': 'Mazagon Dock Shipbuilders', 'percentage': 15.4},
                    {'company': 'Cochin Shipyard', 'percentage': 12.8},
                    {'company': 'Bharat Dynamics', 'percentage': 10.2}
                ],
                'description': 'Tracks Nifty India Defence Index with defense manufacturing and aerospace companies'
            },
            {
                'name': 'SBI PSU Fund',
                'type': 'Equity Fund',
                'expected_return': 16.5,
                'risk_level': 'High',
                'holdings_url': 'https://www.sbimf.com/en-us/individual/our-funds/equity-funds/sbi-psu-fund',
                'top_holdings': [
                    {'company': 'Bharat Electronics', 'percentage': 6.5},
                    {'company': 'NTPC', 'percentage': 8.5},
                    {'company': 'Power Grid', 'percentage': 7.2},
                    {'company': 'ONGC', 'percentage': 6.9},
                    {'company': 'Indian Oil', 'percentage': 6.5}
                ],
                'description': 'PSU-focused fund with defense sector exposure'
            }
        ]
    },
    'it': {
        'name': 'Information Technology',
        'funds': [
            {
                'name': 'ICICI Prudential Technology Fund',
                'type': 'Sectoral Fund',
                'expected_return': 17.5,
                'risk_level': 'High',
                'holdings_url': 'https://www.icicipruamc.com/mutual-fund/equity-funds/icici-prudential-technology-fund',
                'top_holdings': [
                    {'company': 'TCS', 'percentage': 18.5},
                    {'company': 'Infosys', 'percentage': 16.8},
                    {'company': 'HCL Technologies', 'percentage': 12.4},
                    {'company': 'Wipro', 'percentage': 10.2},
                    {'company': 'Tech Mahindra', 'percentage': 8.7}
                ],
                'description': 'Invests in IT services, software, and technology companies'
            },
            {
                'name': 'Nippon India ETF Nifty IT',
                'type': 'ETF',
                'expected_return': 16.0,
                'risk_level': 'High',
                'holdings_url': 'https://mf.nipponindiaim.com/FundsAndPerformance/Pages/Nippon-India-ETF-Nifty-IT.aspx',
                'top_holdings': [
                    {'company': 'TCS', 'percentage': 20.3},
                    {'company': 'Infosys', 'percentage': 18.9},
                    {'company': 'HCL Technologies', 'percentage': 13.2},
                    {'company': 'Wipro', 'percentage': 11.5},
                    {'company': 'Tech Mahindra', 'percentage': 9.8}
                ],
                'description': 'Tracks Nifty IT Index with top IT companies'
            }
        ]
    },
    'pharma': {
        'name': 'Pharmaceuticals & Healthcare',
        'funds': [
            {
                'name': 'Nippon India Pharma Fund',
                'type': 'Sectoral Fund',
                'expected_return': 15.5,
                'risk_level': 'High',
                'holdings_url': 'https://mf.nipponindiaim.com/FundsAndPerformance/Pages/Nippon-India-Pharma-Fund.aspx',
                'top_holdings': [
                    {'company': 'Sun Pharma', 'percentage': 15.8},
                    {'company': 'Divi\'s Laboratories', 'percentage': 12.4},
                    {'company': 'Dr. Reddy\'s Labs', 'percentage': 11.7},
                    {'company': 'Cipla', 'percentage': 10.5},
                    {'company': 'Aurobindo Pharma', 'percentage': 9.2}
                ],
                'description': 'Focuses on pharmaceutical and healthcare companies'
            },
            {
                'name': 'SBI Healthcare Opportunities Fund',
                'type': 'Sectoral Fund',
                'expected_return': 16.0,
                'risk_level': 'High',
                'holdings_url': 'https://www.sbimf.com/en-us/individual/our-funds/equity-funds/sbi-healthcare-opportunities-fund',
                'top_holdings': [
                    {'company': 'Sun Pharma', 'percentage': 14.2},
                    {'company': 'Apollo Hospitals', 'percentage': 11.8},
                    {'company': 'Divi\'s Laboratories', 'percentage': 10.9},
                    {'company': 'Dr. Reddy\'s Labs', 'percentage': 10.3},
                    {'company': 'Cipla', 'percentage': 9.7}
                ],
                'description': 'Invests in pharma, hospitals, and healthcare services'
            }
        ]
    },
    'banking': {
        'name': 'Banking & Financial Services',
        'funds': [
            {
                'name': 'ICICI Prudential Banking and Financial Services Fund',
                'type': 'Sectoral Fund',
                'expected_return': 16.5,
                'risk_level': 'High',
                'holdings_url': 'https://www.icicipruamc.com/mutual-fund/equity-funds/icici-prudential-banking-and-financial-services-fund',
                'top_holdings': [
                    {'company': 'HDFC Bank', 'percentage': 18.5},
                    {'company': 'ICICI Bank', 'percentage': 16.2},
                    {'company': 'Kotak Mahindra Bank', 'percentage': 12.8},
                    {'company': 'Axis Bank', 'percentage': 11.4},
                    {'company': 'SBI', 'percentage': 10.7}
                ],
                'description': 'Focuses on banking and financial services sector'
            },
            {
                'name': 'Nippon India ETF Bank BeES',
                'type': 'ETF',
                'expected_return': 15.0,
                'risk_level': 'High',
                'holdings_url': 'https://mf.nipponindiaim.com/FundsAndPerformance/Pages/Nippon-India-ETF-Bank-BeES.aspx',
                'top_holdings': [
                    {'company': 'HDFC Bank', 'percentage': 28.5},
                    {'company': 'ICICI Bank', 'percentage': 22.3},
                    {'company': 'Kotak Mahindra Bank', 'percentage': 12.4},
                    {'company': 'Axis Bank', 'percentage': 11.8},
                    {'company': 'SBI', 'percentage': 10.2}
                ],
                'description': 'Tracks Nifty Bank Index'
            }
        ]
    },
    'auto': {
        'name': 'Automobile & Auto Components',
        'funds': [
            {
                'name': 'Tata Digital India Fund',
                'type': 'Thematic Fund',
                'expected_return': 17.0,
                'risk_level': 'High',
                'holdings_url': 'https://www.tatamutualfund.com/fund/tata-digital-india-fund',
                'top_holdings': [
                    {'company': 'Maruti Suzuki', 'percentage': 12.5},
                    {'company': 'Mahindra & Mahindra', 'percentage': 10.8},
                    {'company': 'Tata Motors', 'percentage': 9.7},
                    {'company': 'Bajaj Auto', 'percentage': 8.4},
                    {'company': 'Hero MotoCorp', 'percentage': 7.9}
                ],
                'description': 'Includes auto sector with digital transformation focus'
            }
        ]
    },
    'infrastructure': {
        'name': 'Infrastructure & Construction',
        'funds': [
            {
                'name': 'ICICI Prudential Infrastructure Fund',
                'type': 'Sectoral Fund',
                'expected_return': 18.0,
                'risk_level': 'Very High',
                'holdings_url': 'https://www.icicipruamc.com/mutual-fund/equity-funds/icici-prudential-infrastructure-fund',
                'top_holdings': [
                    {'company': 'Larsen & Toubro', 'percentage': 15.8},
                    {'company': 'UltraTech Cement', 'percentage': 12.4},
                    {'company': 'Power Grid', 'percentage': 10.7},
                    {'company': 'NTPC', 'percentage': 9.8},
                    {'company': 'Adani Ports', 'percentage': 8.9}
                ],
                'description': 'Invests in infrastructure, construction, and capital goods'
            }
        ]
    },
    'energy': {
        'name': 'Energy & Power',
        'funds': [
            {
                'name': 'SBI PSU Fund',
                'type': 'Equity Fund',
                'expected_return': 16.5,
                'risk_level': 'High',
                'holdings_url': 'https://www.sbimf.com/en-us/individual/our-funds/equity-funds/sbi-psu-fund',
                'top_holdings': [
                    {'company': 'NTPC', 'percentage': 8.5},
                    {'company': 'Power Grid', 'percentage': 7.2},
                    {'company': 'ONGC', 'percentage': 6.9},
                    {'company': 'Indian Oil', 'percentage': 6.5},
                    {'company': 'Coal India', 'percentage': 7.8}
                ],
                'description': 'PSU fund with significant energy sector exposure'
            }
        ]
    },
    'fmcg': {
        'name': 'FMCG & Consumer Goods',
        'funds': [
            {
                'name': 'Nippon India ETF Nifty FMCG',
                'type': 'ETF',
                'expected_return': 14.0,
                'risk_level': 'Medium',
                'holdings_url': 'https://mf.nipponindiaim.com/FundsAndPerformance/Pages/Nippon-India-ETF-Nifty-FMCG.aspx',
                'top_holdings': [
                    {'company': 'Hindustan Unilever', 'percentage': 32.5},
                    {'company': 'ITC', 'percentage': 18.7},
                    {'company': 'Nestle India', 'percentage': 12.4},
                    {'company': 'Britannia', 'percentage': 10.8},
                    {'company': 'Dabur India', 'percentage': 8.2}
                ],
                'description': 'Tracks FMCG sector with consumer goods companies'
            }
        ]
    },
    'diversified': {
        'name': 'Diversified / Multi-Sector',
        'funds': [
            {
                'name': 'Axis Bluechip Fund',
                'type': 'Large Cap Fund',
                'expected_return': 15.0,
                'risk_level': 'Medium-High',
                'holdings_url': 'https://www.axismf.com/mutual-fund/equity-fund/axis-bluechip-fund',
                'top_holdings': [
                    {'company': 'HDFC Bank', 'percentage': 8.5},
                    {'company': 'ICICI Bank', 'percentage': 7.2},
                    {'company': 'Infosys', 'percentage': 6.8},
                    {'company': 'Reliance Industries', 'percentage': 6.5},
                    {'company': 'TCS', 'percentage': 5.9}
                ],
                'description': 'Diversified large-cap fund across multiple sectors'
            },
            {
                'name': 'Parag Parikh Flexi Cap Fund',
                'type': 'Flexi Cap Fund',
                'expected_return': 15.0,
                'risk_level': 'High',
                'holdings_url': 'https://www.ppfas.com/schemes/parag-parikh-flexi-cap-fund/',
                'top_holdings': [
                    {'company': 'Alphabet (Google)', 'percentage': 8.2},
                    {'company': 'Microsoft', 'percentage': 7.5},
                    {'company': 'HDFC Bank', 'percentage': 6.8},
                    {'company': 'Infosys', 'percentage': 5.9},
                    {'company': 'Amazon', 'percentage': 5.2}
                ],
                'description': 'Diversified across Indian and international equities'
            }
        ]
    }
}

def get_sectors_list():
    """Return list of available sectors"""
    return [
        {'value': 'diversified', 'label': 'Diversified (Recommended)', 'description': 'Balanced across all sectors'},
        {'value': 'metal', 'label': 'Metal & Mining', 'description': 'Steel, aluminum, copper, coal'},
        {'value': 'defense', 'label': 'Defense & Aerospace', 'description': 'Defense manufacturing, aerospace'},
        {'value': 'it', 'label': 'Information Technology', 'description': 'IT services, software'},
        {'value': 'pharma', 'label': 'Pharmaceuticals', 'description': 'Pharma, healthcare'},
        {'value': 'banking', 'label': 'Banking & Finance', 'description': 'Banks, financial services'},
        {'value': 'auto', 'label': 'Automobile', 'description': 'Auto manufacturers, components'},
        {'value': 'infrastructure', 'label': 'Infrastructure', 'description': 'Construction, capital goods'},
        {'value': 'energy', 'label': 'Energy & Power', 'description': 'Oil, gas, power generation'},
        {'value': 'fmcg', 'label': 'FMCG & Consumer', 'description': 'Consumer goods, retail'}
    ]

def get_sector_funds(sector_preferences, use_api=True):
    """
    Get funds based on sector preferences with API integration and fallback
    sector_preferences: list of sector keys (e.g., ['metal', 'defense'])
    use_api: whether to try fetching from API first (default: True)
    
    Returns: (funds_list, data_source_info)
    """
    if not sector_preferences or 'diversified' in sector_preferences:
        # Return diversified funds (always static)
        return SECTOR_FUNDS['diversified']['funds'], {'source': 'static', 'reason': 'diversified_selected'}
    
    # Try API first if enabled
    if use_api:
        try:
            from mf_api_service import mf_api_service
            api_funds, is_api_data = mf_api_service.get_all_funds_for_sectors(sector_preferences)
            
            if is_api_data and api_funds:
                return api_funds, {
                    'source': 'api',
                    'api_name': 'MFApi',
                    'fund_count': len(api_funds),
                    'has_live_nav': True
                }
        except Exception as e:
            import logging
            logging.error(f"API fetch failed: {e}")
    
    # Fallback to static data with deduplication
    selected_funds = []
    seen_fund_names = set()
    
    for sector in sector_preferences:
        if sector in SECTOR_FUNDS:
            for fund in SECTOR_FUNDS[sector]['funds']:
                # Deduplicate by fund name (static data doesn't have scheme_code)
                fund_name = fund.get('name', '')
                if fund_name and fund_name not in seen_fund_names:
                    seen_fund_names.add(fund_name)
                    selected_funds.append(fund)
    
    result_funds = selected_funds if selected_funds else SECTOR_FUNDS['diversified']['funds']
    return result_funds, {
        'source': 'static',
        'reason': 'api_unavailable' if use_api else 'api_disabled',
        'fund_count': len(result_funds)
    }

# Made with Bob
