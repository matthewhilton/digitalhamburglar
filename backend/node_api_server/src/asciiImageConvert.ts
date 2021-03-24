import { download } from "./middleware/routers/imageRouter"
const path = require('path')
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
const fs = require('fs')
const puppeteer = require('puppeteer');
const sharp = require('sharp');

// Use an online website and pupeteer to asciify a given image (and return an image - NOT a text string like many libraries do)
export default function asciiImageConvert(image_url: string, hash: string): Promise<string> {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let image_temp_name = uuidv4() + '.png'
                let temp_image_path = path.join(__dirname, image_temp_name)
                download(image_url, temp_image_path, () => {
                    console.log("starting browser");

                    console.log("Using temp path: ", temp_image_path);

                    (async () => {
                        const browser = await puppeteer.launch({defaultViewport: null, headless: true, args: [
                            "--disable-notifications"
                          ]});
                          
                        const page = await browser.newPage();

                        await page.setViewport({width: 1600, height: 1600, deviceScaleFactor: 1});

                        page.on('dialog', async (dialog) => {
                            console.log(dialog.message());
                            await dialog.dismiss();
                          });
                        
                        await page.goto('https://asciiart.club/');

                        await delay(2000)

                        const elementHandle = await page.$("input[type=file]");
                        await elementHandle.uploadFile(temp_image_path);

                        await delay(10000)

                        await page.waitForSelector('#getfilego')

                        const btn = await page.$('#getfilego')
                        await btn.evaluate(btn => btn.click())

                        delay(500)

                        await btn.evaluate(btn => btn.click())
                        
                        await page.waitForSelector('#iout')
                        await delay(500)

                        const text_button = await page.$('#charbtn')
                        await text_button.evaluate(text_button => text_button.click())

                        await delay(500)

                        const braile_button = await page.$('label[for="tradio4"]')
                        await braile_button.evaluate(braile_button => braile_button.click())

                        await delay(500)

                        await page.evaluate(() => document.querySelector('input[name="charsdone"]')?.scrollIntoView());
                        await page.$eval('input[name="charsdone"]', elem => elem.click());

                        await delay(500)

                        
                        const color_btn = await page.$('#colorbtn')
                        await color_btn.evaluate(color_btn => color_btn.click())

                        await delay(500)

                        const bow = await page.$('label[for="cradio1"]')
                        await bow.evaluate(bow => bow.click())

                        await delay(1000)

                        const color_done = await page.$('#colorsdone')
                        await color_done.evaluate(color_done => color_done.click())
                          

                        console.log("waiting for image to load before taking screenshot")
                        await delay(5000);

                        
                        await page.waitForSelector('#iout')
                        await page.evaluate(() => document.querySelector('#iout')?.scrollIntoView());
                        // Query the image element
                        const svgImage = await page.$('#iout');

                        fs.unlinkSync(temp_image_path)

                        await delay(2000);

                        await svgImage.screenshot({
                            path: temp_image_path,
                            omitBackground: true,
                        });

                        await delay(2000);
                        await browser.close();

                        // Do some more modification with sharp 
                        const image_save_path = path.resolve('public', 'offerImages', hash + '.png')
                        sharp(temp_image_path)
                        .extract({ width: 350, height: 350, left: 30, top: 30 })
                        .tint("green")
                        .toFile(image_save_path)
                        .then(function() {
                            // Delete temp image
                            fs.unlinkSync(temp_image_path)
                            resolve(image_save_path);
                        })
                        .catch(function(err) {
                            fs.unlinkSync(temp_image_path)
                            reject(err)
                        });

                      })();
                });
            } catch {
                reject("Error when converting image")
            }
          })();
    })
}

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }