exports.sign = async function sign({web3, privateKey, message = "hello world"}) {
    const hash = web3.eth.accounts.hashMessage(message);
    console.log(`hash : ${hash}`);
    const signature = web3.eth.accounts.sign(message, privateKey);
    console.log(`signature : ${JSON.stringify(signature, null, 4)}`);
};

exports.recover = async function recover({web3, signature, message = "hello world"}) {
    const address = web3.eth.accounts.recover(message, signature);
    console.log(`address : ${address}`);
};
//
// callWeb3Sign command called - privateKey: e5e2a5f8e8f786b61a08af8770afe9a3f5bc3fa7cce000ec932372b6732fe018, message: hello world
//
// hash : 0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68
// signature : {
//     "message": "hello world",
//         "messageHash": "0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68",
//         "v": "0x1b",
//         "r": "0x03325eb8d7617e10a6fa106a65284c438bf6529016c64e84af158a62aac28529",
//         "s": "0x5e810f0823a094ec65cd4ada8bb85e605c59de327ba408bf8f33fce5b3faf9bd",
//         "signature": "0x03325eb8d7617e10a6fa106a65284c438bf6529016c64e84af158a62aac285295e810f0823a094ec65cd4ada8bb85e605c59de327ba408bf8f33fce5b3faf9bd1b"
// }
