import { useEffect, useState, useContext, useCallback } from "react";
import bwipjs from "bwip-js"
import Countdown from "./Countdown";
import { OffersContext } from "../hooks/offersContext";

export default function OfferCode({ claim, onDeleteClaim }) {
    const [barcode, setBarcode] = useState({ data: null, error: null });
    const { data: { offers } } = useContext(OffersContext);

    const updateBarcodeData = useCallback(async () => {
        setBarcode({ data: null, error: null });
        const res = await fetch(`https://hamburglarapi.azure-api.net/hamburglarv4/redeem?claimKey=${claim.id}`);
        const json = await res.json();

        if (res.ok) {
            setBarcode({ data: json, error: null })
        } else {
            setBarcode({ data: null, error: json.error })
        }
    }, [claim, setBarcode])

    useEffect(() => {
        updateBarcodeData();
    }, [claim, updateBarcodeData])

    useEffect(() => {
        if (barcode.data != null) {
            const options = {
                bcid: "azteccode",
                text: barcode.data.barcodeData
            }
            bwipjs.toCanvas("codeCanvas", options)
        }
    }, [barcode])

    const { data, error } = barcode;
    const loading = !data && !error;

    const selectedOffer = offers ? offers.find(offer => offer.hash === claim.offerHash) : null;

    if (loading) return <h1 className="text-white"> Loading... </h1>

    return (
        <div>
            {!error &&
                <div className="flex flex-col content-center align-center items-center">
                    <div className="bg-white rounded-lg p-4 w-64 shadow-xl flex flex-col items-center">
                        <canvas id="codeCanvas" style={{ width: '100%', height: '100%', maxWidth: 200, maxHeight: 200 }} className="m-4" />
                        <p className="font-bold text-center text-5xl"> {data.code} </p>
                    </div>

                    <p className="text-pink-200 font-bold text-lg mt-2 text-center"> Offer claimed for <Countdown to={Math.max(Math.floor((claim.expiry - Date.now()) / 1000), 0)} /> seconds</p>
                </div>
            }

            <div className="flex flex-row align-center flex-wrap">
                {!error && <button className="flex-grow bg-pink-700 rounded-lg text-white font-bold shadow-xl p-4 m-5 bg-blend-lighten active:bg-pink-800" onClick={() => updateBarcodeData()}> Get new code </button>}
                <button className="flex-grow bg-pink-700 rounded-lg text-white font-bold shadow-xl p-4 m-5 bg-blend-lighten active:bg-pink-800" onClick={() => onDeleteClaim()}> Forfeit offer claim </button>

            </div>

            {error &&
                <div>
                    <p className="text-white text-center font-bold"> Error: {error} </p>
                </div>}

            {selectedOffer &&
            <div className="flex flex-col items-center mt-5">
                <p className="text-white font-bold"> Offer claim details </p>
                <p className="text-white break-all"> {selectedOffer.name} </p>
                <p className="text-white break-all mt-2"> Hash: {selectedOffer.hash} </p>
            </div>}
        </div>
    )
}