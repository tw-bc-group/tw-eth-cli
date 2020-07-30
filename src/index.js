#!/usr/bin/env node
const path = require('path');
const untildify = require('untildify');
const fs = require('fs');
const program = require('commander');
const transferUtil = require('./transfer');
const transferEthUtil = require('./transferEth');
const callContractUtil = require('./callContract');
const decodeUtil = require('./decodeTxRaw');
const txUtil = require('./getTransaction');
const inspect = require('./inspects');
const version = require('../package.json').version

program.version(`eth cli ${version}`);

program
    .command('transfer')
    .option('-c, --contract <type>', 'contract address')
    .option('-f, --from <type>', 'from address')
    .option('-p, --pk <type>', 'from address private key')
    .option('-t, --to <type>', 'to address')
    .option('-a, --abi <type>', 'abi')
    .option('-m, --money <type>', 'money')
    .option('--config <type>', 'config')
    .description('transfer token with PK')
    .action(transfer);

program
    .command('transferEth')
    .option('-f, --from <type>', 'from address')
    .option('-p, --pk <type>', 'from address private key')
    .option('-t, --to <type>', 'to address')
    .option('-m, --money <type>', 'money')
    .option('--config <type>', 'config')
    .description('transfer eth')
    .action(transferEth);

program
    .command('callContract')
    .option('-f, --from <address>', 'from address')
    .option('-m, --method <method>', 'contract method name')
    .option('-p, --parameters <parameters>', 'comma separated parameters', commaSeparatedList)
    .option('--config <config>', 'config file path')
    .description('call contract')
    .action(callContract);

program
    .command('callContractReturnValue')
    .option('-f, --from <string>', 'from address')
    .option('-m, --method <string>', 'contract method name')
    .option('-p, --parameters <parameters>', 'comma separated parameters', commaSeparatedList)
    .option('--config <string>', 'config file path')
    .description('call contract to get return value')
    .action(callContractReturnValue);

function commaSeparatedList(value, dummyPrevious) {
    return value.split(',');
}

program
    .command('transferWithPassword')
    .option('-c, --contract <string>', 'contract address')
    .option('-f, --from <string>', 'from address')
    .option('-t, --to <string>', 'to address')
    .option('-a, --abi <string>', 'abi')
    .option('-m, --money <number>', 'money')
    .option('-p, --password <password>', 'password')
    .option('--config <string>', 'config')
    .description('transfer token by personal account')
    .action(transferWithPassword);


program
    .command('transferEthWithPassword')
    .option('-f, --from <string>', 'from address')
    .option('-t, --to <string>', 'to address')
    .option('-m, --money <number>', 'money')
    .option('-p, --password <password>', 'password')
    .option('--config <string>', 'config')
    .description('transfer eth by personal account')
    .action(transferEthWithPassword);


program
    .command('decode')
    .option('-r, --raw <string>', 'raw transaction')
    .option('-a, --abi <string>', 'abi')
    .option('--config <string>', 'config')
    .description('decode raw transaction')
    .action(decode);

program
    .command('getTx')
    .option('-h, --hash <string>', 'transaction hash')
    .option('-a, --abi <string>', 'abi')
    .option('--config <string>', 'config')
    .description('get transaction, decode data with abi')
    .action(getTx);

program
    .command('getBlockTxs')
    .option('-s, --start <string>', 'start block number')
    .option('-e, --end <string>', 'end block number')
    .option('-f, --filter-address <string>', 'filter address')
    .option('-a, --abi <string>', 'abi')
    .option('--config <string>', 'config')
    .description('get block transactions, decode data with abi')
    .action(getBlockTxs);

program
    .command('pool')
    .option('-c, --cmd <string>', 'content | inspect | status')
    .option('-u, --url <string>', 'url use by web3')
    .option('--config <string>', 'config url')
    .description('get transaction pool')
    .action(txPool);

program
    .command('recoverTx')
    .option('-r, --raw <string>', 'raw transaction')
    .option('--config <string>', 'config url')
    .description('recover transaction, return address')
    .action(recoverTx);

program
    .command('balanceOf')
    .option('-f, --from-address <string>', 'from address')
    .option('-c, --contract-address <string>', 'contract address')
    .option('-a, --abi <string>', 'abi')
    .option('--config <string>', 'config url')
    .description('balance of address')
    .action(balanceOf);

program
    .command('inspect')
    .option('-k, --privateKey <string>', 'private key')
    .description('derive private key to public key with address')
    .action(privateKeyToPublicKey);

program
    .command('keystore')
    .option('-f, --file <string>', 'file')
    .option('-p, --password <password>', 'password', "")
    .description('read keystore')
    .action(importKeyStore);

program.parse(process.argv);

function readConfig(configName = "~/tw-eth-cli-config.js") {
    let config = {};
    const filePath = path.normalize(untildify(configName));
    console.log(`config path: ${filePath}`);
    if (fs.existsSync(filePath)) {
        console.log(`config path exist`);
        config = require(filePath);
    }
    return config;
}

async function importKeyStore(cmdObj) {
    let {file, config: configName, password} = cmdObj;
    const config = readConfig(configName);
    let filePath = path.normalize(untildify(file));
    if (!path.isAbsolute(file)) {
        filePath = path.normalize(untildify(path.join(process.cwd(), file)));
    }
    console.log(`importKeyStore path: ${filePath}`);
    const Web3 = require("web3");
    const web3 = new Web3(config.url);
    const raw = fs.readFileSync(filePath);
    let keystoreJsonV3 = JSON.parse(raw);
    let decryptedAccount = web3.eth.accounts.decrypt(keystoreJsonV3, password);
    const ethers = require('ethers');
    const wallet = new ethers.Wallet(decryptedAccount.privateKey);
    console.log(`wallet：${JSON.stringify(wallet)}`);
}

async function balanceOf(cmdObj) {
    let {fromAddress, contractAddress, abi, config: configName} = cmdObj;
    const config = readConfig(configName);
    if (!fromAddress) {
        fromAddress = config.fromAddress;
    }
    if (!contractAddress) {
        contractAddress = config.contractAddress;
    }
    if (!abi) {
        abi = config.abi;
    }

    console.log("\n--------------balanceOf--------------\n");
    console.log(`balanceOf command called - fromAddress: ${fromAddress}, contractAddress: ${contractAddress}\n`);
    const Web3 = require("web3");
    const web3 = new Web3(config.url);
    await transferUtil.balanceOf(web3, fromAddress, contractAddress, abi)
}

async function recoverTx(cmdObj) {
    let {raw, url, config: configName} = cmdObj;
    const config = readConfig(configName);
    if (!raw) {
        raw = config.raw;
    }
    if (!url) {
        url = config.url;
    }

    console.log("\n--------------recoverTx--------------\n");
    console.log(`recoverTx command called - raw: ${raw}\n`);
    const Web3 = require("web3");
    const web3 = new Web3(url);

    const ethers = require('ethers');
    const tx = ethers.utils.parseTransaction(raw);
    console.log(`decoded Tx: ${JSON.stringify(tx, null, 4)}`);

    const addr = web3.eth.accounts.recoverTransaction(raw);
    console.log(`address : ${addr}`);
}

async function txPool(cmdObj) {
    let {cmd, url, config: configName} = cmdObj
    const config = readConfig(configName);
    if (!cmd) {
        cmd = config.cmd;
    }
    if (!url) {
        url = config.url;
    }
    console.log("\n--------------txPool--------------\n");
    console.log(`txPool command called - cmd: ${cmd}, url: ${url}\n`);
    const Web3 = require("web3");
    const web3 = new Web3(url);
    web3.eth.extend({
        property: 'txpool',
        methods: [{
            name: 'content',
            call: 'txpool_content'
        }, {
            name: 'inspect',
            call: 'txpool_inspect'
        }, {
            name: 'status',
            call: 'txpool_status'
        }]
    });

    let ret;
    switch (cmd) {
        case "content":
            ret = await web3.eth.txpool.content();
            break;
        case "inspect":
            ret = await web3.eth.txpool.inspect();
            break;
        case "status":
            ret = await web3.eth.txpool.status();
            break;
        default:
            ret = await web3.eth.txpool.content();
    }
    console.log(JSON.stringify(ret, null, 4));
}

async function getBlockTxs(cmdObj) {
    let {start, end, filterAddress, abi, config: configName} = cmdObj
    const config = readConfig(configName);
    if (!start) {
        start = config.start;
    }
    if (!end) {
        end = config.end;
    }
    if (!filterAddress) {
        filterAddress = config.filterAddress;
    }
    if (!abi) {
        abi = config.abi;
    }
    console.log("\n--------------get block transactions--------------\n");
    console.log(`getBlockTxs command called - start: ${start}, end: ${end}, filterAddress: ${filterAddress}, abi length: ${JSON.stringify(abi.length)}\n`);
    const Web3 = require("web3");
    const web3 = new Web3(config.url);
    await txUtil.getBlockTxs(web3, start, end, filterAddress, abi);
}

async function getTx(cmdObj) {
    let {hash, abi, config: configName} = cmdObj;
    const config = readConfig(configName);
    if (!hash) {
        hash = config.hash;
    }
    if (!abi) {
        abi = config.abi;
    }
    console.log("\n--------------get transaction by hash--------------\n");
    console.log(`getTx command called - raw: ${hash}, abi length: ${JSON.stringify(abi.length)}\n`);
    const Web3 = require("web3");
    const web3 = new Web3(config.url);
    await txUtil.getTxHash(web3, hash, abi);
}

function decode(cmdObj) {
    let {raw, abi, config: configName} = cmdObj;
    const config = readConfig(configName);
    if (!raw) {
        raw = config.raw;
    }
    if (!abi) {
        abi = config.abi;
    }

    console.log("\n--------------decode--------------\n");
    console.log(`decode command called - raw: ${raw}, abi length: ${JSON.stringify(abi.length)}\n`);

    decodeUtil(raw, abi);
}

//
// .option('-m, --method <type>', 'contract method name')
//     .option('-p, --parameters <parameters>', 'comma separated parameters', commaSeparatedList)
//     .option('--config <type>', 'config')

async function callContract(cmdObj) {
    let {method, parameters, config: configName, from: fromAddress, fromAddressPK, contractAddress, abi} = cmdObj;
    const config = readConfig(configName);
    if (!contractAddress) {
        contractAddress = config.contractAddress;
    }
    if (!fromAddressPK) {
        fromAddressPK = config.fromAddressPK;
    }
    if (!fromAddress) {
        fromAddress = config.fromAddress;
    }
    if (!method) {
        method = config.method;
    }
    if (!abi) {
        abi = config.abi;
    }

    const Web3 = require("web3");
    const web3 = new Web3(config.url);

    console.log("\n--------------callContract--------------\n");

    await callContractUtil.callContract({
        web3,
        contractAddress,
        method,
        fromAddress,
        fromAddressPK,
        abi,
        parameters,
        gasPrice: config.gasPrice,
        gasLimit: config.gasLimit
    });
}

async function callContractReturnValue(cmdObj) {
    let {method, parameters, config: configName, from: fromAddress, fromAddressPK, contractAddress, abi} = cmdObj;
    const config = readConfig(configName);
    if (!contractAddress) {
        contractAddress = config.contractAddress;
    }
    if (!fromAddressPK) {
        fromAddressPK = config.fromAddressPK;
    }
    if (!fromAddress) {
        fromAddress = config.fromAddress;
    }
    if (!method) {
        method = config.method;
    }
    if (!abi) {
        abi = config.abi;
    }

    const Web3 = require("web3");
    const web3 = new Web3(config.url);

    console.log("\n--------------callContract--------------\n");

    await callContractUtil.callContractReturnValue({
        web3,
        contractAddress,
        method,
        fromAddress,
        fromAddressPK,
        abi,
        parameters,
        gasPrice: config.gasPrice,
        gasLimit: config.gasLimit
    });
}

async function transferEth(cmdObj) {
    let {from: fromAddress, pk: fromAddressPK, to: toAddress, money, config: configName} = cmdObj;
    const config = readConfig(configName);
    if (!fromAddress) {
        fromAddress = config.fromAddress;
    }
    if (!toAddress) {
        toAddress = config.toAddress;
    }
    if (!money) {
        money = config.money;
    }
    if (!fromAddressPK) {
        fromAddressPK = config.fromAddressPK;
    }

    const Web3 = require("web3");
    const web3 = new Web3(config.url);

    console.log("\n--------------Transfer ETH--------------\n");
    console.log(`transfer command called - fromAddress: ${fromAddress}, toAddress: ${toAddress}, money: ${money}`);

    await transferEthUtil.transferEth({web3, fromAddress, fromAddressPK, toAddress, money});
}

async function transferEthWithPassword(cmdObj) {
    let {from: fromAddress, to: toAddress, money, password, config: configName} = cmdObj;
    const config = readConfig(configName);

    if (!fromAddress) {
        fromAddress = config.fromAddress;
    }
    if (!toAddress) {
        toAddress = config.toAddress;
    }
    if (!password) {
        password = config.password;
    }
    if (!money) {
        money = config.money;
    }

    const Web3 = require("web3");
    const web3 = new Web3(config.url);

    console.log("\n--------------Transfer ETH By Personal Account--------------\n");
    console.log(`transfer command called - fromAddress: ${fromAddress}, toAddress: ${toAddress}, money: ${money}, config.url: ${config.url}`);

    await transferEthUtil.transferEthByPersonalAccount({web3, fromAddress, toAddress, money, password});
}

async function transfer(cmdObj) {
    let {contract: contractAddress, from: fromAddress, pk: fromAddressPK, to: toAddress, abi, money, password, config: configName} = cmdObj;
    const config = readConfig(configName);
    if (!contractAddress) {
        contractAddress = config.contractAddress;
    }
    if (!fromAddress) {
        fromAddress = config.fromAddress;
    }
    if (!toAddress) {
        toAddress = config.toAddress;
    }
    if (!abi) {
        abi = config.abi;
    }
    if (!password) {
        password = config.password;
    }
    if (!money) {
        money = config.money;
    }
    if (!fromAddressPK) {
        fromAddressPK = config.fromAddressPK;
    }

    const Web3 = require("web3");
    const web3 = new Web3(config.url);

    console.log("\n--------------Transfer--------------\n");
    console.log(`transfer command called - contractAddress: ${contractAddress}, fromAddress: ${fromAddress}, toAddress: ${toAddress}, money: ${money}`);

    await transferUtil.transfer(web3, contractAddress, fromAddress, fromAddressPK, toAddress, abi, money);
}

async function transferWithPassword(cmdObj) {
    let {contract: contractAddress, from: fromAddress, pk: fromAddressPK, to: toAddress, abi, money, password, config: configName} = cmdObj;
    const config = readConfig(configName);

    if (!contractAddress) {
        contractAddress = config.contractAddress;
    }
    if (!fromAddress) {
        fromAddress = config.fromAddress;
    }
    if (!toAddress) {
        toAddress = config.toAddress;
    }
    if (!abi) {
        abi = config.abi;
    }
    if (!password) {
        password = config.password;
    }
    if (!money) {
        money = config.money;
    }
    if (!fromAddressPK) {
        fromAddressPK = config.fromAddressPK;
    }

    const Web3 = require("web3");
    const web3 = new Web3(config.url);

    console.log("\n--------------Transfer By Personal Account--------------\n");
    console.log(`transfer command called - contractAddress: ${contractAddress}, fromAddress: ${fromAddress}, toAddress: ${toAddress}, money: ${money}`);

    await transferUtil.transferByPersonalAccount(web3, contractAddress, fromAddress, toAddress, abi, money, password);
}

function privateKeyToPublicKey(cmdObj) {
    let {privateKey: privateKey} = cmdObj;

    console.log(JSON.stringify(inspect.privateKeyToPublicKey(privateKey), null, 4));
}
