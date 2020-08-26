exports.transferEthByPersonalAccount = async function (
    {
        web3,
        fromAddress,
        toAddress,
        money = "1.1",
        password = "",
        gasPrice = 0,
        gasLimit = 210000
    }) {

    let unlock = await web3.eth.personal.unlockAccount(fromAddress, password, 600);
    console.log(`unlock ${fromAddress} : ${unlock}`);

    const beforeBalance = await web3.eth.getBalance(fromAddress);
    console.log(`beforeBalance: ${web3.utils.fromWei(beforeBalance)}`);
    const nonce = await web3.eth.getTransactionCount(fromAddress);

    const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toWei(money, "ether"),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        nonce,
        data:web3.utils.toHex('My father is yin')
    });
    const afterBalanceFrom = await web3.eth.getBalance(fromAddress);
    const afterBalanceTo = await web3.eth.getBalance(toAddress);
    console.log(`afterBalanceFrom:${web3.utils.fromWei(afterBalanceFrom)}, afterBalanceTo:${web3.utils.fromWei(afterBalanceTo)}`);
    console.log(`Receipt: ${JSON.stringify(receipt, null, 4)}`);
};

exports.transferEth = async function (
    {
        web3,
        fromAddress,
        fromAddressPK,
        toAddress,
        money = "1.1",
        gasPrice = 0,
        gasLimit = 210000
    }) {
    const nonce = await web3.eth.getTransactionCount(fromAddress);
    const tx = await web3.eth.accounts.signTransaction({
        nonce: web3.utils.toHex(nonce),
        to: toAddress,
        value: web3.utils.toWei(money, "ether"),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        data:web3.utils.toHex('My father is yin')
    }, fromAddressPK);
    const beforeBalance = await web3.eth.getBalance(fromAddress);
    console.log(`beforeBalance: ${web3.utils.fromWei(beforeBalance)}`);
    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    const afterBalanceFrom = await web3.eth.getBalance(fromAddress);
    const afterBalanceTo = await web3.eth.getBalance(toAddress);
    console.log(`afterBalanceFrom:${web3.utils.fromWei(afterBalanceFrom)}, afterBalanceTo:${web3.utils.fromWei(afterBalanceTo)}`);
    console.log(`Receipt: ${JSON.stringify(receipt, null, 4)}`);
};
