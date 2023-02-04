import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
import styles from "@/styles/Home.module.css"
import { useEffect, useState } from "react"
import { PaystackButton } from "react-paystack"
import Modal from "../components/modal"
import CloseIcon from "../components/CloseModalIcon"
import {
  sendImage,
  getImage,
  getScreensById,
  addCustomers,
} from "../../supabase"
import styled from "styled-components"
import useModal from "../hooks/useModal"

export default function Home() {
  const { isModalopen, toggleModal } = useModal()
  const [imageholder, setImageHolder] = useState([])
  const [getImageUrl, setGetImageUrl] = useState([])
  const [sem, setSem] = useState([])
  const [useremail, setUseremail] = useState("")
  const [latestQuantity, setLatestQuantity] = useState()
  const [imagelength, setImageLength] = useState(0)
  const [displayButton, setDisplayButton] = useState(true)
  const [imagesMap, setImagesMap] = useState([])

  useEffect(() => {
    if (imagelength > 2 && imagelength < 4) {
      setDisplayButton(false)
    }
  }, [imagelength])

  function showPaystack() {
    toast("please input a maximum of three images")
  }
  useEffect(() => {
    async function getProducts() {
      const getImage = await getScreensById()
      toast.success(getImage)
      setSem(getImage)
      setLatestQuantity(getImage[0].price)
      // toast.success(getImage[0].price *quantity)
    }
    getProducts()
  }, [])
  toast.success(sem)

  useEffect(() => {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    //     if(!useremail.match(validRegex)){
    // toast.success("not a valid email address")
    //     }
    if (useremail.match(validRegex) && imagelength > 2 && imagelength < 4) {
      imageholder.map((image) => {
        toast.success(image)
        const imageUrl = getImage("hbrs", image)
        setGetImageUrl((prev) => {
          return [...prev, imageUrl.publicUrl]
        })
      })
    }
  }, [imageholder, useremail])
  toast.success(getImageUrl)

  useEffect(() => {
    if (useremail && imagelength > 2 && imagelength < 4) {
      imagesMap.map(async (image) => {
        const data = await sendImage(image)
        setImageHolder((prev) => {
          return [...prev, data?.path]
        })
      })
    }
  }, [imagelength, useremail])

  async function handleChange(event) {
    if (event.target.files.length < 5) {
      let fileSize = 0
      for (let i = 0; i < event.target.files.length; i++) {
        fileSize += event.target.files.item(i).size
      }
      toast.success(fileSize)
      const fileMb = fileSize / 1024 ** 2

      if (fileMb >= 2) {
        toast.success("maximum file size exceeded")
        // fileResult.innerHTML = "Please select a file less than 2MB.";
        // fileSubmit.disabled = true;
      } else {
        setImageLength(event.target.files.length)
        // fileResult.innerHTML = "Success, your file is " + fileMb.toFixed(1) + "MB.";
        // fileSubmit.disabled = true;
        for (let i = 0; i < event.target.files.length; i++) {
          setImagesMap((prev) => {
            return [...prev, event.target.files[i]]
          })
        }
      }
    } else {
      toast.success("maximum file length exceeded")
    }
  }

  function handleChangeEmail(e) {
    setUseremail(e.target.value)
  }

  const config = {
    reference: new Date().getTime().toString(),
    email: useremail,
    amount: latestQuantity * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  }

  const handlePaystackSuccessAction = async (reference) => {
    // Implementation for whatever you want to do with reference and after success call.

    const data = await addCustomers(useremail, reference.reference, getImageUrl)
    if (data) toast.success("Thank you for your purchase")
    toggleModal()
    setUseremail("")
  }

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    toast.success("closed")
  }

  const componentProps = {
    ...config,
    text: "Buy now",
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  }

  return (
    <>
      <ToastContainer autoClose={2000} position="top-center" />
      <main className={styles.main}>
        <div className={styles.description}>
          {isModalopen && (
            <Modal toggleModal={toggleModal}>
              <SocialModalBox>
                <CloseIcon toggle={toggleModal} />
                <ModalWrapper>
                  <div>
                    <label>Email: </label>

                    <input
                      type="text"
                      value={useremail}
                      onChange={handleChangeEmail}
                      required
                    />
                  </div>

                  <input
                    type="file"
                    onChange={handleChange}
                    id="avatar"
                    name="avatar"
                    accept="image/png, image/jpeg"
                    required
                    multiple
                  />

                  <div>
                    <h1>₦{sem[0]?.price}</h1>
                  </div>
                  {displayButton ? (
                    <div className="purchaseButton" onClick={showPaystack}>
                      Buy Now
                    </div>
                  ) : (
                    <PaystackButton
                      className="purchaseButton"
                      {...componentProps}
                    />
                  )}
                </ModalWrapper>
              </SocialModalBox>
            </Modal>
          )}
        </div>

        <ContentWrapper>
          {sem.map((product) => {
            return (
              <div key={product.name}>
                <AbsoluteBlur>
                  {/* <h2>{product.header}</h2>  */}
                  <h2>{product.name}</h2>
                  <p> {product.description}</p>
                  <p>₦ {product.price}</p>
                  <button className="checkButton" onClick={() => toggleModal()}>
                    Checkout
                  </button>
                </AbsoluteBlur>
                <ImageWrapper>
                  {product.images.map((image) => {
                    return (
                      <div>
                        <img src={image} />
                      </div>
                    )
                  })}
                </ImageWrapper>
              </div>
            )
          })}
        </ContentWrapper>
      </main>
    </>
  )
}

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  div {
    padding: 0 15px;
  }
`
const ModalWrapper = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  input {
    background: white;
    padding: 12px;
    border: 1px solid rgb(221, 221, 221);
    border-radius: 40px;
  }
  h1 {
    color: white;
  }
  label {
    color: black;
  }
  .purchaseButton {
    isplay: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding: 1rem 1.3rem;
    cursor: pointer;
    border: none;
    border-radius: 40px;
    outline: none;
    font-size: 16px;
    font-weight: 400;
    background-color: orange;
    color: white;
  }
`
const ContentWrapper = styled.div`
  position: relative;
`
const AbsoluteBlur = styled.div`
  backdrop-filter: blur(12px) saturate(0%) contrast(0.5);
  /* display: flex; */
  flex-direction: column;
  gap: 12px;
  -webkit-backdrop-filter: blur(12px);
  padding: 12px 24px 25px 14px;
  font-size: 12px;
  border-radius: 20px;
  z-index: 99;
  bottom: 25px;
  background: transparent;
  /* right: 49px; */
  max-width: 485px;
  border: 1px solid #80808038;
  width: 100%;
  position: fixed;
  transform: translate(-50%, 0);
  right: 50%;
  left: 50%;
  display: flex;
  @media only screen and (min-width: 600px) {
    padding: 12px 54px 65px 14px;
    font-size: 16px;
  }
  h2 {
    color: white;
  }
  .checkButton {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding: 1rem 1.3rem;
    cursor: pointer;
    border: none;
    border-radius: 40px;
    outline: none;
    font-size: 16px;
    font-weight: 400;
    background-color: orange;
  }
  p {
    color: white;
  }
`
const PaymentCta = styled.div`
  width: 100%;
  font-size: 16px;
  padding: 0.8em 0;
  border: 1px solid #aaa;
  background-color: #fff;
  border-radius: 0.5em;
  text-align: center;
  margin-top: 1em;
  color: black !important;
  cursor: pointer;
`
const SocialModalBox = styled.div`
  width: 80%;
  position: relative;
  background-color: #fff;
  max-width: 37.5rem;
  padding: 0.5em 1.6rem 1.6rem;
  border-radius: 0.5rem;
`
