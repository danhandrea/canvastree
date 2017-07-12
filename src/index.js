import FTE from './FTE/fte.js';

const SPACE_ID = '27ilh582y9vh'
const ACCESS_TOKEN = 'bab307f2ade4aab1ae42a127683d79505330dda6d17bb7c2f96c2235a2e6681d'


var fte = new FTE();

window.addEventListener('load', () => {
    const client = contentful.createClient({
        // This is the space ID. A space is like a project folder in Contentful terms
        space: SPACE_ID,
        // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
        accessToken: ACCESS_TOKEN
    });

    fte.init(client);
});

window.fte = fte;