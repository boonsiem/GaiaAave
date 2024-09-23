const axios = require('axios');

async function fetchAaveData() {
    const query = `{
        protocols {
            financialMetrics {
                dailyFlashloanUSD
                dailyDepositUSD
                dailyBorrowUSD
                dailyLiquidateUSD
                dailyProtocolSideRevenueUSD
                dailyTotalRevenueUSD
            }
        }
    }`;

    try {
        const response = await axios.post('https://gateway.thegraph.com/api/777c5a23ceb27b5d644fdc26ff59454b/subgraphs/id/C2zniPn45RnLDGzVeGZCx2Sw3GXrbc9gL4ZfL8B8Em2j', { query });
        // Assuming protocols is an array
        const financialMetrics = response.data.data.protocols[0].financialMetrics;
        console.log(financialMetrics);
        return financialMetrics;
    } catch (error) {
        console.error('Error fetching Aave data:', error);
        return [];
    }
}

async function fetchLlamaInsights(data) {
    const dataString = data
        .map(d => `Daily Flashloan USD: ${d.dailyFlashloanUSD}, Daily Deposit USD: ${d.dailyDepositUSD}, Daily Borrow USD: ${d.dailyBorrowUSD}, Daily Liquidate USD: ${d.dailyLiquidateUSD}, Daily Protocol Side Revenue USD: ${d.dailyProtocolSideRevenueUSD}, Daily Total Revenue USD: ${d.dailyTotalRevenueUSD}`)
        .join('\n');
    
    const prompt = `Here's the data from Aave protocol:\n${dataString}\nPlease provide insights about this data.`;

    try {
        const response = await axios.post('https://llama.us.gaianet.network/v1/chat/completions', {
            model: 'llama',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that analyzes financial data and provides insights.' },
                { role: 'user', content: prompt }
            ]
        });
        console.log(response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching Llama Insights:', error);
        return '';
    }
}

async function runApp() {
    const data = await fetchAaveData();
    const insights = await fetchLlamaInsights(data);
    console.log(insights);
}

runApp();