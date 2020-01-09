import React from 'react'
import "./NewComponent.global.css"

class NewComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        return (
            <div>NewComponent</div>
        )
    }
}
export default NewComponent