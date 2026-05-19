/**
 * Digital Financial Literacy & Inclusion Platform
 * Bank Logos and Resources
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize bank logos and resources
    initBankLogos();
    
    // Initialize resource cards
    initResourceCards();
});

/**
 * Initialize bank logos
 */
function initBankLogos() {
    // Bank logos data
    const bankLogos = [
        {
            name: 'National Bank of Egypt',
            logo: 'images/bank_logos/nbe.png',
            services: ['Accounts', 'Loans', 'Cards', 'Mobile Banking'],
            hotline: '19623'
        },
        {
            name: 'Banque Misr',
            logo: 'images/bank_logos/banque_misr.png',
            services: ['Accounts', 'Loans', 'Cards', 'Mobile Banking'],
            hotline: '19888'
        },
        {
            name: 'Commercial International Bank (CIB)',
            logo: 'images/bank_logos/cib.png',
            services: ['Accounts', 'Loans', 'Cards', 'Mobile Banking'],
            hotline: '19666'
        },
        {
            name: 'QNB Alahli',
            logo: 'images/bank_logos/qnb.png',
            services: ['Accounts', 'Loans', 'Cards', 'Mobile Banking'],
            hotline: '19700'
        },
        {
            name: 'HSBC Egypt',
            logo: 'images/bank_logos/hsbc.png',
            services: ['Accounts', 'Loans', 'Cards', 'Mobile Banking'],
            hotline: '19007'
        },
        {
            name: 'Arab African International Bank',
            logo: 'images/bank_logos/aaib.png',
            services: ['Accounts', 'Loans', 'Cards', 'Mobile Banking'],
            hotline: '19555'
        }
    ];
    
    // Create bank options in account opening module
    const bankOptionsContainer = document.querySelector('.bank-options');
    if (bankOptionsContainer) {
        bankOptionsContainer.innerHTML = '';
        
        bankLogos.forEach(bank => {
            const bankOption = document.createElement('div');
            bankOption.className = 'bank-option';
            bankOption.innerHTML = `
                <img src="${bank.logo}" alt="${bank.name} logo" onerror="this.src='images/bank_buildings.jpeg'">
                <h4>${bank.name}</h4>
            `;
            
            bankOptionsContainer.appendChild(bankOption);
        });
    }
    
    // Create bank resource cards
    const bankResourcesContainer = document.querySelector('#bank-resources');
    if (bankResourcesContainer) {
        bankResourcesContainer.innerHTML = '';
        
        bankLogos.forEach(bank => {
            const resourceCard = document.createElement('div');
            resourceCard.className = 'resource-card';
            
            let servicesTags = '';
            bank.services.forEach(service => {
                servicesTags += `<span class="service-tag">${service}</span>`;
            });
            
            resourceCard.innerHTML = `
                <div class="resource-logo">
                    <img src="${bank.logo}" alt="${bank.name} logo" onerror="this.src='images/bank_buildings.jpeg'">
                </div>
                <h4>${bank.name}</h4>
                <p>Provides a range of financial services for individuals and businesses.</p>
                <div class="resource-services">
                    ${servicesTags}
                </div>
                <p><strong>Hotline:</strong> ${bank.hotline}</p>
                <div class="resource-actions">
                    <a href="#" class="btn btn-outline open-account-btn" data-bank="${bank.name}">Open Account</a>
                    <a href="#" class="btn btn-primary">Visit Website</a>
                </div>
            `;
            
            bankResourcesContainer.appendChild(resourceCard);
        });
    }
}

/**
 * Initialize resource cards
 */
function initResourceCards() {
    // Financial education resources data
    const educationResources = [
        {
            name: 'Central Bank of Egypt',
            logo: 'images/resources/cbe.png',
            description: 'Official resources on financial inclusion and literacy initiatives in Egypt.',
            services: ['Financial Education', 'Regulations', 'Consumer Protection'],
            website: 'https://www.cbe.org.eg/'
        },
        {
            name: 'Financial Regulatory Authority',
            logo: 'images/resources/fra.png',
            description: 'Information on non-banking financial services and consumer protection.',
            services: ['Insurance', 'Microfinance', 'Consumer Protection'],
            website: 'https://fra.gov.eg/'
        },
        {
            name: 'Egyptian Banking Institute',
            logo: 'images/resources/ebi.png',
            description: 'Educational resources and training programs on financial literacy.',
            services: ['Training', 'Research', 'Financial Education'],
            website: 'https://www.ebi.gov.eg/'
        }
    ];
    
    // Create education resource cards
    const educationResourcesContainer = document.querySelector('#education-resources');
    if (educationResourcesContainer) {
        educationResourcesContainer.innerHTML = '';
        
        educationResources.forEach(resource => {
            const resourceCard = document.createElement('div');
            resourceCard.className = 'resource-card';
            
            let servicesTags = '';
            resource.services.forEach(service => {
                servicesTags += `<span class="service-tag">${service}</span>`;
            });
            
            resourceCard.innerHTML = `
                <div class="resource-logo">
                    <img src="${resource.logo}" alt="${resource.name} logo" onerror="this.src='images/financial_chart.jpeg'">
                </div>
                <h4>${resource.name}</h4>
                <p>${resource.description}</p>
                <div class="resource-services">
                    ${servicesTags}
                </div>
                <div class="resource-actions">
                    <a href="${resource.website}" target="_blank" class="btn btn-primary">Visit Website</a>
                </div>
            `;
            
            educationResourcesContainer.appendChild(resourceCard);
        });
    }
    
    // Digital financial services data
    const digitalServices = [
        {
            name: 'Fawry',
            logo: 'images/resources/fawry.png',
            description: 'Digital payment platform for bills, mobile recharges, and other services.',
            services: ['Bill Payments', 'Mobile Recharge', 'Merchant Payments'],
            website: 'https://fawry.com/'
        },
        {
            name: 'Vodafone Cash',
            logo: 'images/resources/vodafone.png',
            description: 'Mobile wallet service for transfers, payments, and withdrawals.',
            services: ['Mobile Wallet', 'Money Transfer', 'Bill Payments'],
            website: 'https://web.vodafone.com.eg/en/vodafone-cash'
        },
        {
            name: 'Meeza',
            logo: 'images/resources/meeza.png',
            description: 'National payment scheme providing digital payment solutions.',
            services: ['Digital Payments', 'Cards', 'ATM Services'],
            website: 'https://www.meezacard.com/'
        }
    ];
    
    // Create digital services resource cards
    const digitalServicesContainer = document.querySelector('#digital-services');
    if (digitalServicesContainer) {
        digitalServicesContainer.innerHTML = '';
        
        digitalServices.forEach(service => {
            const resourceCard = document.createElement('div');
            resourceCard.className = 'resource-card';
            
            let servicesTags = '';
            service.services.forEach(s => {
                servicesTags += `<span class="service-tag">${s}</span>`;
            });
            
            resourceCard.innerHTML = `
                <div class="resource-logo">
                    <img src="${service.logo}" alt="${service.name} logo" onerror="this.src='images/credit_card.jpeg'">
                </div>
                <h4>${service.name}</h4>
                <p>${service.description}</p>
                <div class="resource-services">
                    ${servicesTags}
                </div>
                <div class="resource-actions">
                    <a href="${service.website}" target="_blank" class="btn btn-primary">Visit Website</a>
                </div>
            `;
            
            digitalServicesContainer.appendChild(resourceCard);
        });
    }
}

// Create placeholder images for bank logos
function createPlaceholderBankLogos() {
    const bankNames = [
        'National Bank of Egypt',
        'Banque Misr',
        'Commercial International Bank (CIB)',
        'QNB Alahli',
        'HSBC Egypt',
        'Arab African International Bank'
    ];
    
    // Create bank logos directory
    const bankLogosDir = '/home/ubuntu/financial_website/images/bank_logos';
    if (!fs.existsSync(bankLogosDir)) {
        fs.mkdirSync(bankLogosDir, { recursive: true });
    }
    
    // Create placeholder logos
    bankNames.forEach(name => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, 200, 100);
        
        // Draw border
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2;
        ctx.strokeRect(5, 5, 190, 90);
        
        // Draw text
        ctx.fillStyle = '#212121';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Split name into lines if needed
        const words = name.split(' ');
        if (words.length > 2) {
            const line1 = words.slice(0, 2).join(' ');
            const line2 = words.slice(2).join(' ');
            ctx.fillText(line1, 100, 40);
            ctx.fillText(line2, 100, 60);
        } else {
            ctx.fillText(name, 100, 50);
        }
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // Save to file
        const fileName = name.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '') + '.png';
        const filePath = `${bankLogosDir}/${fileName}`;
        
        // Use fetch to save the file
        fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], fileName, { type: 'image/png' });
                const formData = new FormData();
                formData.append('file', file);
                
                // Save file using server endpoint
                fetch('/save-image', {
                    method: 'POST',
                    body: formData
                });
            });
    });
}
