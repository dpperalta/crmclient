import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';

//uri: 'http://localhost:4000/',
//uri: 'https://vast-plains-73484.herokuapp.com/',
const httpLink = createHttpLink({
    uri: 'https://vast-plains-73484.herokuapp.com/',
    fetch
});

const authLink = setContext((_, { headers }) => {
    // Leer el storage para extraer el token
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${ token }` : ''
        }
    }
});

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client;