export default {
    headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
    },

    get: function (options) {
        let promise,
            headers = Object.assign(this.headers, options.headers);

        promise = fetch(options.url, {
            method: 'GET',
            headers: new Headers(headers)
        });

        return promise.then(function (response) {
            if (!response.ok) {
                return Promise.reject(response.json().then(function (data) {
                    throw Error(data.msg);
                }));
            } else {
                return response.json();
            }
        }).catch(function (error) {
            return error;
        });
    },

    post: function (options) {
        let promise,
            headers = (options.ignoreDefaultHeaders) ? Object.assign({}, options.headers) : Object.assign(this.headers, options.headers);

        promise = fetch(options.url, {
            body: (options.ignoreStringify) ? options.data : JSON.stringify(options.data),
            method: 'POST',
            headers: new Headers(headers)
        });

        return promise.then(function (response) {
            if (!response.ok) {
                return Promise.reject(response.json().then(function (data) {
                    throw Error(data.msg);
                }));
            } else {
                return response.json();
            }
        }).catch(function (error) {
            return error;
        });
    },
}

