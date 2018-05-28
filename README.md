Mandatory Exercise 4 - Authentication in React and Angular
==========================================================

**The deadline for this exercise is Tuesday May 29, 07.59.**

For this **mandatory exercise 4** you should work on **master branch only**.

## Preparation

1. Create a new repository on [Github](github.com) called **mandatory-auth**

2. Follow the instructions that Github gives you; create a local repository and add a remote or clone
the recently created repository.

## Submission

When you do the submission of your exercise in Ping Pong, **before the deadline**,
you will enter the link to your repository, such as:

```
https://github.com/mygithubusername/mandatory-auth
```

The teacher will look in the **master branch**. If any commits are done to the master branch after the deadline, the grade IG will follow.

You will either get **G** or **IG** on the mandatory exercises.

## Instructions
In this exercise you will learn how to authenticate users and, once they have been authenticated, access protected API routes. You will build the same application using both React and Angular.

### Styles
Bootstrap is imported in both the Angular and React versions.

### Application Walkthrough
The application will have the following behaviour:

#### Initial view.

![](_images/screen1.png)

When first navigating to the application the user is not authenticated. 

A status bar at the top displays the _User ID_, which defaults to 'N/A'. 

Clicking the 'Test API' button sends a request to the `/api/friends/` API route, which returns the current user's list of friends. Accessing this route requires the user to be authenticated; in this instance, the request returns the following error object, logged in the console:

```javascript
{ error: "Unauthorized token" }
```

The error message indicates that the so-called _access token_ sent along with the request could not be authorized to return the list of friends (which again is not possible since the user has not been authenticated yet).

#### Login.

A login form is rendered to allow the user to login with a username and password (called _credentials_). The form performs simple validation on the credentials:

*   *username*: Must not be an empty string.
*   *password*: Must be at least 8 characters.

The login button is disabled while the credentials are invalid.

If the user tries to login with faulty credentials an error message is displayed:

![](_images/screen2.png)

The error object returned in the API response:

```javascript
{ error: "Invalid user credentials" }
```

#### Successful user authentication.

Upon entering a valid username and password the user is authenticated:

![](_images/screen3.png)

The _User ID_ now presents the user's name and a 'Logout' button is shown. Clicking the 'Test API' button now returns the following list:

```javascript
["alice", "bob"]
```

If the page is reloaded, the user should still be authenticated. Clicking the 'Logout' button returns the user to the initial view (first image above).

### Authenticating Users
Your application will authenticate a user in the following manner:

*   The application, upon startup, checks to see if the user has previously logged in; it does this by retrieving an *access token* from local storage. If the token is not available, the login form is displayed.

*   The user enters and submits credentials that are sent to the backend. If they are validated, meaning they match credentials stored on the backend, a token is created and returned; the user is now authenticated.

*   The application stores the token in local storage. It also _decodes_ the token, getting the user's name to display (more on tokens below). 

*   When accessing a protected API route, the application includes this HTTP header in the request:

    `Authorization: Bearer <token>`

where `<token>` is the user's access token.

*   The backend gets the request and verifies the token. If verification is successful, an API response is returned, otherwise the token is unauthorized to access the API route.

### JSON Web Tokens (JWT)
As described earlier, the backend authorizes user requests via access tokens. A token is simply an encoded string, carrying information about the user that can be verified.

A common token format is JSON Web Tokens, [JWT](https://jwt.io/). Such a token contains three parts - a header, payload and signature. 

User data, such as ID and name, is put in the payload as key/value pairs. The header and payload is then run through a signature algorithm that, together with a _secret_, produces a signature to be used for token verification later on. Using the debugger on the JWT site, you can try changing the payload and see the resulting token output.

Typically, a backend creates a token for an authenticated user similar to the procedure shown on the JWT site. When a backend later receives an API request with a token, its signature is recreated using the secret that the backend alone knows about. The incoming and recreated signatures are compared and if they match, the user is considered authorized to access the API route.  

In this exercise you will not perform signature verification (or other operations such as checking if a token has expired), instead you will create a token on the JWT site that is to be hardcoded in your application and returned to the application upon user authentication. Authorizing the user will entail simply matching two strings - the incoming and hardcoded tokens.

Your token's payload should only the contain the following properties (you are free to change the values):

```json
{
    "sub": "me@domain.com",
    "name": "John Doe"
}
```

The `sub` property uniquely identifies the user; the `name` property will be used in the status bar to show the _User ID_.

#### JWT Decoding
To get the payload data in a token, it must be decoded. To accomplish this you will use a function called `jwt_decode(token)`. It returns an object with the payload properties. 

### Mock Backends
In this exercise you will not implement a backend server (in e.g. nodejs and express), rather you will set up a mock backend (in React and Angular) _within the application itself_ that simulates a real backend with API routes and user authentication/authorization. 

See the React and Angular sections below for how to create a mock backend in each environment. 

#### API Routes
The mock backend will have two routes:

*   /api/auth

    User credentials are POSTed to this route upon login. 

    Possible responses:

    *   401, 'Invalid user credentials'

        If the username and/or password are invalid.

    *   200, { token }

        If authentication is successful, a object with a (hardcoded) token is returned.

*   /api/friends

    A request is GETed to this route to get the user's list of friends.

    Possible responses:

    *   400, 'No authorization header'

        If the 'Authorization' HTTP header is missing.

    *   401, 'Unauthorized token'

        If the token is not authorized to access this API route.

    *   200, friends

        If token verification is successful, an array of strings representing the user's friends is returned.

The backend returns a generic 400, 'Unsupported request' if it's unable to handle a request (i.e. for an unrecognized route). 

### Angular
First run 
    
    npm install
    
to install all dependencies.

Run

    ng serve

to start the development server.

To implement the Angular version of the application the following steps must be performed:

*   `app.component.html`

    Add the relevant markup where indicated.

*   `app.component.ts`

    Add the required code to perform user authentication and test access to the API using the service `AuthService`.

*   `auth.service.ts`

    Add the required code to make AuthService functional.

*   `auth-interceptor.ts`

    Add the required code to implement a mock backend.

Read the comments in each of these files for more details.

#### Interceptors
To simulate a mock backend in angular so-called 'HTTP interceptors' are used. As the name indicates, these intercept HTTP requests and allows for custom processing before they are actually sent. 

In this instance, HTTP interceptors are used to 'short-circuit' all requests, meaning they're never sent but rather handled within the application itself.

#### HttpClient
`AuthService` uses the service `HttpClient` instead of the regular `Http` service. HttpClient is very similar to Http, with a minor tweak: when issuing a request, you specify the type of the response body. 

E.g., when POSTing to `/api/auth`, you expect a successful response body to be of type `AuthResponse`, an interface defined in `auth.service.ts`:

```javascript
this.http.post<AuthResponse>(url)
```

And when getting the user's friends:

```javascript
this.http.get<string[]>(url, options)
```

For sending requests to protected API routes, you must include the custom 'Authorization' header. See this angular [documentation](https://angular.io/guide/http#sending-data-to-the-server) for information about adding custom headers.

### React
First run 

    npm install 

to install all dependencies.

Run

    npm start

to start the development server.

To implement the React version of the application the following steps must be performed:

*   `App.js`

    Add the required code using `AuthService` to update component state and render the proper markup.

*   `Login.js`

    Add the required code to update component state and render the login form. Remember that you must perform validation manually; to e.g. *enable* the submit button, you must check whether the entered username is not empty and the password is >= 8 characters.

*   `http.js`

    This file creates a mock backend using [axios](https://github.com/axios/axios), an HTTP library. Axios, in contrast to the `HttpClient` service in Angular, uses Promises instead of Observables.
    
    Add the required code to return HTTP responses in the callbacks passed to the `onPost` and `onGet` methods (these 'mocks' correspond the the API routes). 

    To return a mock response, return an array with the first element being the status and the second element being the response body.

    E.g., in the callbacks to `onPost` and `onGet`, to return a response with status 200 and a JSON object:

    ```javascript
    return [
        200,
        { prop: '' }
    ]
    ```

    More information about axios mocks [here](https://github.com/ctimmerm/axios-mock-adapter).

*   `authService.js`

    Add the required code to make AuthService functional.

    Note that this module imports the `http.js` module; the latter exports axios with a mock backend. 

    Read the axios documentation for how use axios in the AuthService (where axios is aliased as `http`). E.g., to customize a request, axios can be invoked as follows in AuthService:

    ```javascript
    http({
        method: 'POST | GET',
        url: '/api/...',
        headers: {
            /* custom header(s) */
        }
    })
    ```

Read the comments in each of these files for more details.