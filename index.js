'use strict';
const URL = require('url');

exports.handler = (event, context, callback) => {
    var request = event.Records[0].cf.request;
    var isBlacklistedDomain = false;

    try{
        if(request.headers.referer) {
            for(let ref of request.headers.referer){
                var refURL = URL.parse(ref.value);
                if(isDomainBlacklisted[refURL.hostname]) {
                    isBlacklistedDomain = true;
                    console.log("Domain Blacklisted:" + refURL.hostname);
                }
            }
        }
    } catch (err) {
      console.log("Error parsing refererURL for: " + err);
    }
    
    if(isBlacklistedDomain) {
        callback(null, blacklistDomainResponse);
    } else {
        callback(null, request);
    }
};

const blacklistDomainResponse = {
    status: '403',
    statusDescription: 'Forbidden',
    headers: {
        'cache-control': [{
            key: 'Cache-Control',
            value: 'max-age=100'
        }],
        'content-type': [{
            key: 'Content-Type',
            value: 'text/html'
        }],
        'content-encoding': [{
            key: 'Content-Encoding',
            value: 'UTF-8'
        }],
    },
    body: 'Access Denied',
};
    
const isDomainBlacklisted = {};
isDomainBlacklisted['example.com'] = true;
isDomainBlacklisted['co.uk.example.com'] = true;
isDomainBlacklisted['another.example.com'] = true;