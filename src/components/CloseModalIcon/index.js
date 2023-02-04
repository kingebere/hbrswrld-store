import styled, { css } from "styled-components"

const CloseIcon = ({ toggle }) => {
  return (
    <Close onClick={toggle}>
      <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="presentation"
        focusable="false"
      >
        <path d="m6 6 20 20"></path>
        <path d="m26 6-20 20"></path>
      </svg>
    </Close>
  )
}

const Close = styled.span`
  position: relative;
  left: 93%;
  width: 40px;
  height: 40px;
  margin: "5px 0 0 10px";
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  :hover {
    background-color: #f0efef;
  }
  svg {
    display: block;
    fill: none;
    height: 18px;
    width: 18px;
    stroke: black;
    stroke-width: 4;
    overflow: visible;
  }

  @media (max-width: 760px) {
    left: 88%;
  }
`

export default CloseIcon
