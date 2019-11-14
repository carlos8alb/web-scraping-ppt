const puppeteer = require('puppeteer');
const fs = require('fs-extra');

(async function main() {

    const url = 'http://inteatro.gob.ar/InstitucionesCulturales?search=&type=&province='
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    var result = [];

    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    await page.waitForSelector('.container .institucion-detalle');
    var instituciones = await page.$$('.container .institucion-detalle');

    let img = '';
    let tipo = '';
    let nombre = '';
    let direccion = '';
    let region = '';
    let provincia = '';
    let ciudad = '';
    let phone = '';
    let mail = '';
    let web = '';

    for (let institucion of instituciones) {

        try {
            img = await institucion.$eval('.img-sala', nodes => nodes.src);
        } catch {
            img = '';
        }
        try {
            tipo = await institucion.$eval('.info-institucion .tipo', (n => n.innerText));
        } catch {
            tipo = '';
        }
        try {
            nombre = await institucion.$eval('.info-institucion .nombre', (n => n.innerText));
        } catch {
            nombre = '';
        }
        try {
            direccion = await institucion.$eval('.direction', (n => n.innerText));
        } catch {
            direccion = '';
        }
        try {
            region = await institucion.$eval('.region', (n => n.innerText));
        } catch {
            region = '';
        }
        try {
            provincia = await institucion.$eval('.provincia', (n => n.innerText));
        } catch {
            provincia = '';
        }
        try {
            ciudad = await institucion.$eval('.ciudad', (n => n.innerText));
        } catch {
            ciudad = '';
        }
        try {
            phone = await institucion.$eval('.phone', (n => n.innerText));
        } catch {
            phone = '';
        }
        try {
            mail = await institucion.$eval('.email', (n => n.innerText));
        } catch {
            mail = '';
        }
        try {
            web = await institucion.$eval('.web', (n => n.innerText));
        } catch {
            web = '';
        }

        result.push({
            'img': img,
            'tipo': tipo,
            'nombre': nombre,
            'direccion': direccion,
            'region': region,
            'provincia': provincia,
            'ciudad': ciudad,
            'phone': phone,
            'mail': mail,
            'web': web
        });

        console.log({
            'img': img,
            'tipo': tipo,
            'nombre': nombre,
            'direccion': direccion,
            'region': region,
            'provincia': provincia,
            'ciudad': ciudad,
            'phone': phone,
            'mail': mail,
            'web': web
        });

    }

    console.log('Total: ', result.length);
    await fs.appendFileSync('places.txt', JSON.stringify(result))
    await browser.close()
})();