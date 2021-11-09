import { Suspense } from 'react'
import { Img } from 'react-image'
import md5 from 'blueimp-md5';
import { FillSpinner } from 'react-spinners-kit';

export const OfferImage = ({ img }) => {
  const srcList = [
    `https://offerimagestorev4.blob.core.windows.net/images/${md5(img)}.jpg`,
    `https://hamburglarapi.azure-api.net/hamburglarv4/offer/image?image=${img}`
  ];

  return (
    <Suspense>
      <Img className="rounded-lg brightness-200"
        src={srcList}
        loader={<ImageSpinner />}
      />
    </Suspense>
  )
}

const ImageSpinner = () => (
  <div className="flex flex-row justify-center h-52 items-center bg-black rounded-lg">
    <FillSpinner color="#1bf298" />
  </div>
)