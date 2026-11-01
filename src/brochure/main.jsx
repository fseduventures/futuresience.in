import React from 'react'
import ReactDOM from 'react-dom/client'
// Static (non-variable) fonts: Chrome embeds these in the PDF as real TrueType fonts,
// so the text stays live and editable when the .ai / PDF is opened in Illustrator.
// (Variable fonts get flattened to uneditable Type 3 outlines.)
import '@fontsource/sora/500.css'
import '@fontsource/sora/600.css'
import '@fontsource/sora/700.css'
import '@fontsource/sora/800.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './brochure.css'
import './brochure-light.css'
import Brochure from './Brochure.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<Brochure />)
