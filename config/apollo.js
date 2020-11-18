import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';

//uri: 'https://vast-plains-73484.herokuapp.com/',
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/',
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