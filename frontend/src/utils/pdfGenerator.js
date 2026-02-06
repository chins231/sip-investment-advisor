import jsPDF from 'jspdf';

/**
 * Generate and download a professional PDF report from recommendation data
 * @param {string} userName - User's name
 * @param {object} data - Complete recommendation data including user preferences
 * @param {object} userPreferences - User's input preferences (amount, duration, risk, etc.)
 */
export const generatePDF = async (userName, data, userPreferences = {}) => {
  try {
    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'pdf-loading';
    loadingDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 2rem 3rem;
      border-radius: 12px;
      z-index: 10000;
      text-align: center;
      font-size: 1.2rem;
      font-weight: 600;
    `;
    loadingDiv.innerHTML = '📄 Generating PDF Report...<br><small style="font-size: 0.9rem; font-weight: 400;">Please wait</small>';
    document.body.appendChild(loadingDiv);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yPos = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace = 20) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Helper function to format currency (using Rs. instead of ₹ for PDF compatibility)
    const formatCurrency = (amount) => {
      const formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0,
      }).format(amount);
      return `Rs.${formatted}`;
    };

    // Helper function to format percentage
    const formatPercentage = (value) => {
      return `${value.toFixed(2)}%`;
    };

    // ===== HEADER =====
    pdf.setFillColor(37, 99, 235); // Blue
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SIP Investment Plan', margin, 20);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Prepared for: ${userName}`, margin, 30);
    pdf.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - margin - 50, 30);

    yPos = 50;

    // ===== USER PREFERENCES SECTION =====
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Your Investment Preferences', margin, yPos);
    yPos += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const preferences = [
      { label: 'Monthly Investment', value: formatCurrency(data.portfolio_summary?.total_monthly_investment || 0) },
      { label: 'Investment Duration', value: `${userPreferences.duration || data.portfolio_summary?.investment_period || 'N/A'} years` },
      { label: 'Risk Profile', value: userPreferences.risk_profile || data.portfolio_summary?.risk_profile || 'N/A' },
      { label: 'Investment Mode', value: userPreferences.fund_mode || 'Diversified Portfolio' }
    ];

    preferences.forEach(pref => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${pref.label}:`, margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(pref.value, margin + 60, yPos);
      yPos += 7;
    });

    yPos += 5;
    checkPageBreak(40);

    // ===== PORTFOLIO SUMMARY SECTION =====
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Portfolio Summary', margin, yPos);
    yPos += 10;

    // Summary boxes
    const summaryData = [
      { label: 'Total Investment', value: formatCurrency(data.portfolio_summary.total_invested) },
      { label: 'Expected Value', value: formatCurrency(data.portfolio_summary.expected_portfolio_value) },
      { label: 'Expected Gains', value: formatCurrency(data.portfolio_summary.expected_gains) },
      { label: 'Overall Return', value: formatPercentage(data.portfolio_summary.overall_return_percentage) }
    ];

    pdf.setFillColor(230, 255, 240); // Light green
    pdf.rect(margin, yPos, contentWidth, 35, 'F');
    
    pdf.setFontSize(10);
    const boxWidth = contentWidth / 2;
    const boxHeight = 17;
    
    summaryData.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = margin + (col * boxWidth) + 5;
      const y = yPos + (row * boxHeight) + 5;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(item.label, x, y);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(item.value, x, y + 6);
      pdf.setFontSize(10);
    });

    yPos += 40;
    checkPageBreak(60);

    // ===== RECOMMENDED FUNDS SECTION =====
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommended SIP Funds', margin, yPos);
    yPos += 10;

    data.recommendations.forEach((rec, index) => {
      checkPageBreak(45);
      
      // Fund box
      pdf.setFillColor(240, 248, 255); // Light blue
      pdf.rect(margin, yPos, contentWidth, 40, 'F');
      
      // Fund name
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(37, 99, 235); // Blue
      pdf.text(`${index + 1}. ${rec.fund_name}`, margin + 3, yPos + 7);
      
      // Fund details
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      const details = [
        `Type: ${rec.fund_type}`,
        `Allocation: ${formatPercentage(rec.allocation_percentage)}`,
        `Monthly SIP: ${formatCurrency(rec.monthly_investment)}`,
        `Expected Return: ${formatPercentage(rec.expected_return)}`,
        `Risk Level: ${rec.risk_level}`
      ];
      
      if (rec.cagr_3y) {
        details.push(`3-Year CAGR: ${formatPercentage(rec.cagr_3y)}`);
      }
      
      if (rec.nav) {
        details.push(`Current NAV: Rs.${rec.nav}`);
      }
      
      let detailY = yPos + 14;
      const colWidth = contentWidth / 2;
      
      details.forEach((detail, i) => {
        const col = i % 2;
        const x = margin + 3 + (col * colWidth);
        if (i > 0 && i % 2 === 0) detailY += 5;
        pdf.text(detail, x, detailY);
      });
      
      yPos += 45;
    });

    checkPageBreak(40);
    yPos += 5;

    // ===== DISCLAIMER SECTION =====
    pdf.setFillColor(255, 243, 205); // Light yellow
    pdf.rect(margin, yPos, contentWidth, 35, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(146, 64, 14); // Dark orange
    pdf.text('⚠ Important Disclaimer', margin + 3, yPos + 7);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const disclaimerText = 'These recommendations are based on historical data and mathematical projections. Actual returns may vary based on market conditions. Past performance is not indicative of future results. Please consult with a certified financial advisor before making investment decisions. Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing.';
    const disclaimerLines = pdf.splitTextToSize(disclaimerText, contentWidth - 6);
    let disclaimerY = yPos + 14;
    disclaimerLines.forEach(line => {
      pdf.text(line, margin + 3, disclaimerY);
      disclaimerY += 5;
    });

    // ===== FOOTER =====
    const footerY = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Generated by SIP Investment Advisor | For Educational Purposes Only', pageWidth / 2, footerY, { align: 'center' });

    // Add metadata
    pdf.setProperties({
      title: `SIP Investment Plan - ${userName}`,
      subject: 'SIP Investment Recommendations',
      author: 'SIP Investment Advisor',
      keywords: 'SIP, Investment, Mutual Funds, Portfolio',
      creator: 'SIP Investment Advisor'
    });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `SIP-Investment-Plan-${userName.replace(/\s+/g, '-')}-${timestamp}.pdf`;

    // Save the PDF
    pdf.save(filename);

    // Remove loading indicator
    document.body.removeChild(loadingDiv);

    // Show success message
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 600;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
    `;
    successDiv.innerHTML = '✅ PDF Downloaded Successfully!';
    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 300);
    }, 3000);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    const loadingDiv = document.getElementById('pdf-loading');
    if (loadingDiv) {
      document.body.removeChild(loadingDiv);
    }

    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 600;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    errorDiv.innerHTML = '❌ Failed to generate PDF. Please try again.';
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 3000);

    return false;
  }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Made with Bob
