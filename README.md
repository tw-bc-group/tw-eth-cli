## 使用方法

[English](./README.en.md) / 中文

使用方法
1. 需要在config文件里面配置私钥

tw-eth-cli transfer -t 0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e -m 9.9 --config config.local.quorum.js 

2. 只能在node节点有的账号转账，可以设置password
tw-eth-cli transferWithPassword -t 0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e -m 9.9 --config config.local.quorum.js 

3. 查看命令基本信息
tw-eth-cli

4. 帮助文档
tw-eth-cli help transfer 

5. 全局安转 quorum-cli


6. decode raw transaction
tw-eth-cli decode --config config.js
在config.js里面配置raw，如果想要解析data里面的数据，可以配置对应abi。

7. get transaction by hash
tw-eth-cli getTx --config config.js
在config.js里面配置hash，如果想要解析data里面的数据，可以配置对应abi。

8. get block transactions
tw-eth-cli getBlockTxs --config config.js 
默认同步100个块

9. txpool, 查看节点缓存情况
 tw-eth-cli pool -c status --config config.js 
 tw-eth-cli pool -c content --config config.js 
 tw-eth-cli pool -c inspect --config config.js 

可以用 -u 配置远程节点，不适用config里面的url。

10. recoverTx，从raw transaction拿到地址，比较发送地址，验证签名
tw-eth-cli recoverTx --config config.js

11. balanceOf, 获取eth或者erc20余额
tw-eth-cli balanceOf --config config.js

12. inspect, 派生公钥和地址
tw-eth-cli inspect -k <privateKey> 

13. 读取keystore
 tw-eth-cli keystore -f /Users/yin/projects/twallet/tw-wallet-contract/jsLibTest/key.json
0xca843569e3427144cead5e4d5999a3d0ccf92b8e

