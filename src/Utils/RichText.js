import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import React, { Component } from 'react';

export default class RichText extends Component {
    state = {
        value: ''
    }

    componentWillReceiveProps(nextProp)
    {
        //接受从FormItem传过来的value
        this.setState({
            value: nextProp.value
        })
    }

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            //['blockquote', 'code-block'],
            // ['link', 'image'],

            //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            // [{ 'direction': 'rtl' }],                         // text direction

            // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean']                                         // remove formatting button
        ]
    }

    onValueChange = (value) => {
        this.setState({
            value
        })

        if(this.props.onValueChange)
        {
            this.props.onValueChange(value);
        }
    }

    render() {
        const { value } = this.state
        // console.log(converter.makeMarkdown(value));

        return (
            <ReactQuill
                value={value}
                theme="snow"
                modules={this.modules}
                placeholder= '请输入...'
                // formats={this.formats}
                //className={styles.editContainer}
                style={{height: '230px'}}
                onChange={this.onValueChange} />
        )
    }
}