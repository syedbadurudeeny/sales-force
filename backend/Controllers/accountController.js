const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

const newAccount = asyncHandler( async (req, res) => {
    const { account_info } = req.body;

    if (
        account_info.industry === "" ||
        account_info.companies[0].company_name === "" ||
        account_info.companies[0].size === "" ||
        account_info.companies[0].location === "" ||
        account_info.companies[0].region === "" ||
        account_info.companies[0].potential_revenue === "" ||
        !account_info.companies[0].related_contacts.every(contact => 
            contact.contact_name !== "" && 
            contact.title !== "" && 
            contact.email !== "" && 
            contact.phone !== ""
        )
    ) {
        return res.status(400).json({ message: "All fields are not empty" });
    }

    const accountFile = path.join(__dirname, '..', '..', 'frontend', 'src', 'jsonData', 'accountDatas.json');

    try {
        const jsonData = JSON.parse(fs.readFileSync(accountFile, 'utf8'));

        if (jsonData) {
            
            const industryIndex = jsonData.industries.findIndex(industry => industry.industry.toLowerCase() === account_info.industry.toLowerCase());

            if (industryIndex !== -1) {
               
                jsonData.industries[industryIndex].companies.push({
                    company_name: account_info.companies[0].company_name,
                    size: account_info.companies[0].size,
                    location: account_info.companies[0].location,
                    related_contacts: account_info.companies[0].related_contacts,
                    region: account_info.companies[0].region,
                    potential_revenue: account_info.companies[0].potential_revenue
                });
            } else {
                
                jsonData.industries.push({
                    industry: account_info.industry,
                    companies: [
                        {
                            company_name: account_info.companies[0].company_name,
                            size: account_info.companies[0].size,
                            location: account_info.companies[0].location,
                            related_contacts: account_info.companies[0].related_contacts,
                            region: account_info.companies[0].region,
                            potential_revenue: account_info.companies[0].potential_revenue
                        }
                    ]
                });
            }

            
            fs.writeFileSync(accountFile, JSON.stringify(jsonData, null, 2));

            res.status(200).json({ message: "Account created successfully" });
        }
    } catch (error) {
        console.error('Error updating account data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = { newAccount };
