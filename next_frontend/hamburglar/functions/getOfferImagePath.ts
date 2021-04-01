const CryptoJS = require("crypto-js");

interface Paths {
    func: string,
    cdn: string,
}

export const getOfferImagesPath = (offerImage: string): Paths => {
    const func_basepath = process.env.NEXT_PUBLIC_OFFER_IMAGE_FUNC_ENDPOINT;
    const cdn_basepath = process.env.NEXT_PUBLIC_OFFER_IMAGE_CDN_ENDPOINT;

    // Func path is based off the original offerImage filename
    const func_fullpath = func_basepath + "&image=" + offerImage;

    // CDN path is based off the md5 hash of the offerImage filename
    const cdn_fullpath = cdn_basepath + CryptoJS.MD5(offerImage) + ".jpg";
    
    return {
        func: func_fullpath,
        cdn: cdn_fullpath,
    }
}