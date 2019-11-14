const puppeteer = require('puppeteer');
const fs = require('fs-extra');

(async function main() {

    const url = 'http://www.alternativateatral.com/teatros.asp?pais=1&provincia=1&zona=1'
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    var result = [];
    var button, selector, selectorZona;

    await page.goto(url);
    await page.waitForSelector('.celdadatos');
    var tds = await page.$$eval('.celdadatos', nodes => nodes.map(n => n.innerText))

    var pageNumber = 1;
    while (true) {

        console.log('Página nro: ', pageNumber);
        try {

            for (let index = 0; index < tds.length; index++) {

                if (index % 2 != 0) {

                    try {
                        const text = tds[index].split(`\n`)
                        const name = text[0]
                        const street = text[1].replace('Dirección: ', '')
                        const location = text[2].split(' - ')
                        const city = location[0]
                        const province = location[1]
                        const country = location[2]
                        const tel = text[3].replace('Teléfono: ', '')
                        const web = text[4]

                        result.push({
                            name,
                            street,
                            city,
                            province,
                            country,
                            tel,
                            web,
                            img: ''
                        });

                    } catch (error) {
                        console.log(error);
                    }

                }

            }

            pageNumber = pageNumber + 1;

            try {
                await page.waitForSelector('.actual + li > a');
                button = await page.$('.actual + li > a');
            } catch (error) {
                console.log('No hay mas páginas');
                button = false
            }

            if (button) {
                await button.click();
                await page.waitForSelector('.celdadatos');
                tds = await page.$$eval('.celdadatos', nodes => nodes.map(n => n.innerText))
            } else {
                break;
            }

        } catch (error) {
            console.log(error);
        }

    }

    console.log('Total: ', result.length);
    await fs.appendFileSync('places.txt', JSON.stringify(result))
    await browser.close()
})();