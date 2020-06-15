## 使用方法

[English](./README.md) / 中文

本命令的设计原则是方便使用，把 abi 等比较长的参数配置在 config 中，命令行中的参数可以指定一些经常变化的，比如地址，这样使用起来相当方便。
相比于 eth-cli，本工具更容易使用。

### 1. 安转 tw-eth-cli

`npm install tw-eth-cli -g`

### 2. config 文件

默认读取的 config 路径为 `~/tw-eth-cli-config.js`

| config | comment |
| --- | --- |
| url | web3.js 的 url 参数， 必填项 |
| fromAddress | from Address, 在 transfer 等命令中用到 |
| toAddress | to Address, 在 transfer 等命令中用到 |
| fromAddressPK | from Address private key, 用来签名 |
| contractAddress | 合约地址，用来和合约交互 |
| raw | decode 命令解析交易，如果有设置 abi 可以解析更多信息 |
| hash | 交易 hash，使用 getTx 命令获取交易信息 | 
| password | 如果使用 personal 账户可以指定密码 | 
| money | 转账的金额，转 ETH，ERC20 会用到 |
| abi | 和合约交互，解析交易会用到 |
 

### 3. 查看命令基本信息
 
`tw-eth-cli`
 
 > 大部分命令的参数可以配置在 config 文件中，也可以指定在命令行中，命令行的优先级大于 config。
 
 ### 4. 帮助文档
 
`tw-eth-cli help <commmand>`
 
`tw-eth-cli <commmand> -h `
 
### 5. 转账ERC20

`tw-eth-cli transferWithPassword -t <address> -m <money>` 

>transferWithPassword 是使用 web3.eth.personal 中的 account

`tw-eth-cli transfer -t <address> -m <money>` 

> 注意这里是转账 ERC20，如果想转 ETH，可以使用 MetaMask，或者使用 transferEth 命令

### 6. decode raw transaction

`tw-eth-cli decode --config <config.js>`

在 config.js 里面配置 raw，如果想要解析 data 里面的数据，可以配置对应 abi。本命令可以用来调试各个客户端的签名数据。

### 7. get transaction by hash

`tw-eth-cli getTx --config <config.js>`

在 config.js 里面配置 hash，如果想要解析 data 里面的数据，可以配置对应 abi。

### 8. get block transactions

`tw-eth-cli getBlockTxs`

默认同步100个块

### 9. txpool, 查看节点缓存情况

`tw-eth-cli pool -c status` 
 
`tw-eth-cli pool -c content` 
 
`tw-eth-cli pool -c inspect` 

可以用 -u 配置远程节点，不使用 config 里面的 url。

### 10. recoverTx，验证签名

`tw-eth-cli recoverTx` 

### 11. balanceOf, 获取 eth 或者 erc20 余额

`tw-eth-cli balanceOf -f <address>` 

### 12. inspect, 生成公钥和地址

`tw-eth-cli inspect -k <privateKey>`

### 13. 读取keystore

`tw-eth-cli keystore -f <key.json>`
 
### 14. 转账 ETH
 
`tw-eth-cli transferEth -t <address> -m <money>`

`tw-eth-cli transferEthWithPassword -f <address> -t <address> -m <money>`

### 15. Call Contract

`tw-eth-cli callContract -m <method name> -p <parameter1>,<parameter2> --config <config file path>`



