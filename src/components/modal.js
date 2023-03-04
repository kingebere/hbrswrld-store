import React, { useRef, useState } from "react"
import reactDOM from "react-dom"
import { motion } from "framer-motion"
import styled from "styled-components"
import { useEffect } from "react"

const Modal = ({ children, toggleModal }) => {
  const [isBrowser, setIsBrowser] = useState(false)
  const ref = React.useRef()

  useEffect(() => {
    //get the portal
    ref.current = document.querySelector("#portal")
    setIsBrowser(true)
  }, [])

  useEffect(() => {
    window.onclick = function (event) {
      // nasty bug caused by this className being triggered, I had to target it
      if (event.target.className.baseVal === "") {
      } else if (event.target.className.includes("ModalOverlay")) {
        toggleModal()
      }
    }
  }, [toggleModal])

  if (isBrowser && ref.current) {
    return reactDOM.createPortal(
      <ModalContainer>
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.3,
            },
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {children}
        </ModalOverlay>
      </ModalContainer>,
      document.getElementById("portal")
    )
  }
}

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 100;
  



  




`


const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  display: flex;
  
  align-items: center;
  justify-content: center;

  //to target all elements under it
  & > * {
    z-index: 999;
  }
`

export default Modal
