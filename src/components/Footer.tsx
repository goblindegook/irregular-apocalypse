import { h } from 'preact'
import styled from 'preact-emotion'

const SignatureLine = styled('div')`
  display: none;

  @media print {
    border-bottom: 1px solid #000;
    display: block;
    float: right;
    font-size: .8rem;
    margin: 0 2rem;
    padding-bottom: 2rem;
    text-align: center;
    width: 15rem;
  }
`

export const Footer = () => (
  <footer>
    <SignatureLine>Employer Signature</SignatureLine>
  </footer>
)
