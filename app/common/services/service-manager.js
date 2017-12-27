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
            return response.json();
        });
    },

    post: function (options) {
        let promise,
            headers = Object.assign(this.headers, options.headers);

        promise = fetch(options.url, {
            body: JSON.stringify(options.data),
            method: 'POST',
            headers: new Headers(headers)
        });

        return promise.then(function (response) {
            return response.json();
        });
    }
}

