exports.callWeb3Utils = async function callWeb3Utils({
                                                       web3,
                                                       method,
                                                       parameters = []
                                                   }) {
    console.log(`callWeb3Utils - method: ${method}, parameters: ${parameters}`);
    const data = web3.utils[method](...parameters);
    console.log(`data: ${JSON.stringify(data, null, 4)}`);

};
