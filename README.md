## How to use

English / [中文](./README.zh.md)

- This command wrapper web3.js and introduce simple cli commands to query balance and call contract with ETH, quorum, etc...
- Put long parameters in the config file, such as abi, private key, etc...
- The parameters fill in the console have a higher priority. 

### 1. Install tw-eth-cli

`npm install tw-eth-cli -g`

### 2. config

default config path is `~/tw-eth-cli-config.js`

| config | comment |
| --- | --- |
| url | url of web3.js |
| fromAddress | from Address, used in transfer |
| toAddress | to Address, used in transfer |
| fromAddressPK | from Address private key, sign a transaction |
| contractAddress |contract address, used in callContract |
| raw | decode raw transaction |
| hash | transaction hash, used in getTx | 
| password | transfer by personal account | 
| money | how many tokens to transfer  |
| abi | abi of contract |
 
 
 
 ### 3. Details, all commands
 
`tw-eth-cli`
 
 ### 4. Help
 
`tw-eth-cli help <commmand>`
 
`tw-eth-cli <commmand> -h `
 
### 5. Transfer ERC20

`tw-eth-cli transferWithPassword -t <address> -m <money>` 

>transferWithPassword use accounts in the web3.eth.personal 

`tw-eth-cli transfer -t <address> -m <money>` 

> this command design for ERC20, if you want to transfer ETH, please use transferEth

### 6. decode raw transaction

`tw-eth-cli decode --config <config.js>`

input raw, abi in config file. If you have abi, the data in raw can be decoded. 

### 7. Get transaction by hash.

`tw-eth-cli getTx --config <config.js>`

You can config hash. abi in config file. If you have abi, the data in logs can be decoded. 

### 8. Get block transactions.

`tw-eth-cli getBlockTxs`

default size is 100.

### 9. txpool, check pool status

`tw-eth-cli pool -c status` 
 
`tw-eth-cli pool -c content` 
 
`tw-eth-cli pool -c inspect` 

-u <remote url>，replace url in config.

### 10. Verify signature.

`tw-eth-cli recoverTx` 

### 11. Balance Of ETH and ERC20.

`tw-eth-cli balanceOf -f <address>` 

### 12. Generate public key and address from private key.

`tw-eth-cli inspect -k <privateKey>` 

### 13. Read Keystore.

`tw-eth-cli keystore -f <key.json>`
 
### 14. Transfer ETH.
 
`tw-eth-cli transferEth -t <address> -m <money>` 

`tw-eth-cli transferEthWithPassword -f <address> -t <address> -m <money>`

### 15. Call Contract.

`tw-eth-cli callContract -m <method name> -p <parameter1>,<parameter2> --config <config file path>`

`tw-eth-cli callContractReturnValue -m <method name> -p <parameter1>,<parameter2> --config <config file path>`
