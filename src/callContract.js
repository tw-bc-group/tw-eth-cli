exports.callContract = async function callContract({
                                                       web3,
                                                       contractAddress,
                                                       method,
                                                       fromAddress,
                                                       fromAddressPK,
                                                       abi,
                                                       parameters = [],
                                                       gasPrice = 0,
                                                       gasLimit = 210000
                                                   }) {
    console.log(`callContract - method: ${method}, parameters: ${parameters}, contractAddress:${contractAddress}`);
    const contract = new web3.eth.Contract(abi, contractAddress);
    const data = contract.methods[method](...parameters).encodeABI();
    const nonce = await web3.eth.getTransactionCount(fromAddress);
    const tx = await web3.eth.accounts.signTransaction({
        nonce: web3.utils.toHex(nonce),
        to: contractAddress, // note: this is contractAddress, not toAddress
        value: 0,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        data: data
    }, fromAddressPK);
    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
};
