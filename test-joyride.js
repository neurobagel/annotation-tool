import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:5173');
    
    // Switch to mock mode if not already
    const isMock = await page.evaluate(() => {
        return !!document.querySelector('[data-cy="column-annotation-container"]');
    });
    
    if (!isMock) {
        // Toggle mock mode
        await page.click('button:has-text("Mock UI")');
        // wait for render
        await new Promise(r => setTimeout(r, 1000));
    }
    
    const results = await page.evaluate(() => {
        const assessmentElem = document.querySelector('[data-tour="tour-assessment"]');
        const dataTypesElem = document.querySelector('[data-tour="tour-datatypes"]');
        
        return {
            assessmentExists: !!assessmentElem,
            assessmentRect: assessmentElem ? assessmentElem.getBoundingClientRect() : null,
            dataTypesExists: !!dataTypesElem,
            dataTypesRect: dataTypesElem ? dataTypesElem.getBoundingClientRect() : null,
        };
    });
    
    console.log(JSON.stringify(results, null, 2));
    await browser.close();
})();
