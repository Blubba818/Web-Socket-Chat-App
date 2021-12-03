import React from 'react'
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useSubscription,
    useMutation,
    gql
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { createSourceEventStream } from 'graphql'

const link = new WebSocketLink({
    uri: `ws://localhost:4000`,
    options: {
        reconnect: true
    }
})

const client = new ApolloClient({
    link,
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
})

const GET_MESSAGES = gql`
subscription {
    messages {
        id
        content
        icon
        color
        user
    }
}`

const POST_MESSAGE = gql `
mutation ($user:String!, $icon:String!, $color:String!, $content:String!) {
    postMessage(user: $user, icon: $icon, color: $color, content: $content)
}
`

const Messages = ({ user }) => {
    const { data } = useSubscription(GET_MESSAGES, {
    })
    if (!data) {
        return null
    }

    return (
        <div className="message-box">
            {data.messages.map(({ id, user: messageUser, icon, color, content }) => (
                <div className="d-flex" style={{ justifyContent: user === messageUser ? 'flex-end' : 'flex-start' }}>
                    {user !== messageUser && (
                        <>
                            <div className={icon} style={{ marginRight: '1rem', marginBottom: '1rem' }}></div>
                            <div style={{ color: '#' + color }}>{messageUser}:</div>
                        </>
                    )}
                    <div className="message" style={{ color: '#' + color, overflowWrap: 'break-word' }}>
                        {content}
                    </div>
                    {user === messageUser && (
                        <div className={icon} style={{ marginLeft: '1rem', marginBottom: '1rem'  }}></div>
                    )}
                </div>
            ))}
        </div>
    )
}

const Chat = () => {
    const [state, stateSet] = React.useState({
        user: '',
        icon: 'iffffff',
        color: 'ffffff',
        content: '',
        error: ''
    })

    const [postMessage] = useMutation(POST_MESSAGE)

    const onSend = () => {
        if (state.content != '' && state.user != '') {

            postMessage({
                variables: state
            })
            stateSet({
                ... state,
                content: '',
                error: ''
            })
        } else {
            stateSet({
                ... state,
                error: '*Either your username or message are blank, please check both before sending a message.*'
            })
        }
    }

    return (
        <div className='container'>
            <div className="row" id="title-row">
                <div className="col-sm-1">
                    <div className={state.icon + "xl"}></div>
                </div>
                <div className="col-sm-11">
                    <h1 id="title">Anonymous Chatroom</h1>
                    <h5>Enter a username and select an icon before chatting.</h5>
                </div>
            </div>
            
            
            <div className="row user-info">
                <div className="col-sm-6">
                    <div className="form-group">
                        <label htmlFor='userInput'>Username:</label>
                        <input style={{ color: '#' + state.color }} className='form-control' type="text" id='userInput' value={state.user} onChange={(evt) => stateSet({
                            ... state,
                            user: evt.target.value
                        })}/>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <label htmlFor="icon-select">Icon / Text Color:</label>
                        <select style={{ color: '#' + state.color }} className="form-control" id="icon-select" onChange={(evt) => stateSet ({
                            ... state,
                            icon: evt.target.value,
                            color: evt.target.value.slice(1)
                        })}>
                            <option selected value="iffffff" style={{ color: '#ffffff' }}>White</option>
                            <option value="i9966ff" style={{ color: '#9966ff' }}>Purple</option>
                            <option value="i0099ff" style={{ color: '#0099ff' }}>Blue</option>
                            <option value="iff0040" style={{ color: '#ff0040' }}>Red</option>
                            <option value="iffcc00" style={{ color: '#ffcc00' }}>Yellow</option>
                            <option value="i33cc33" style={{ color: '#33cc33' }}>Green</option>
                            <option value="i00ff99" style={{ color: '#00ff99' }}>Mint</option>
                            <option value="iff9966" style={{ color: '#ff9966' }}>Orange</option>
                            <option value="i9999ff" style={{ color: '#9999ff' }}>Indigo</option>
                            <option value="iff99cc" style={{ color: '#ff99cc' }}>Pink</option>
                        </select>
                    </div>
                </div>
            </div>
            <a href="#message-entry">Go to Bottom</a>
            <Messages user={state.user} />
            <div className="row" id="message-entry">
                <p>You are messaging as:</p>
                <div className="row user-info">
                    <div className="col-sm-1">
                        <div className={state.icon}></div>
                    </div>
                    <div className="col-sm-11">
                        <h5 style={{ color: '#' + state.color }}>{state.user}</h5>
                    </div>

                </div>
                <p id='error'>{state.error}</p>
                <div className="col-sm-11">
                    <div className="form-group">
                        <label htmlFor='messageInput'>Message:</label>
                        <textarea className='form-control' type="text" id='messageInput' rows="5" value={state.content} onChange={(evt) => stateSet({
                            ... state,
                            content: evt.target.value
                        })} onKeyUp={(evt) => {
                            if (evt.keyCode === 13) {
                                onSend()
                            }
                        }} style={{ color: '#' + state.color }}/>
                    </div>
                </div>
                <div className="col-sm-1">
                    <p></p>
                    <button className='btn btn-primary' onClick={() => onSend()}>Send</button>
                </div>
            </div>
            <div className="row">
                <a href="#title">Back to Top</a>
            </div>
        </div>
    )
}

export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
)