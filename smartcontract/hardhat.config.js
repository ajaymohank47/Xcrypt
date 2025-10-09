//https://eth-goerli.g.alchemy.com/v2/OFfemhrpCfHuaJS0yfMG5-ttv6UwGKt-
//c930b0e6f74521ac307ac2b431e13bc092104937c667ef94f017971a74ff2663  metamask private key
//Transactions address:  0x4018a2BFD1500aC6440EADe6631daf6778Ec5ecf

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    // goerli: {
    //   url: 'https://eth-goerli.g.alchemy.com/v2/OFfemhrpCfHuaJS0yfMG5-ttv6UwGKt-',
    //   accounts: ['c930b0e6f74521ac307ac2b431e13bc092104937c667ef94f017971a74ff2663'],
    // },
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/XN_hKPlEW3c-UFSMLcL-TH1DLboPkfrz',
      accounts: ['f1438189e44cab532ebb7f8366f58be603ee7a940420d121641278cd8dbc08c7'],
    }
  },
};


