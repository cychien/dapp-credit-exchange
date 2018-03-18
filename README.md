# dapp-credit-exchange
運行於區塊鏈上的信用交換平台

## 目的
許多的借貸平台都需要一個能夠評估使用者信用的方式，希望藉由這個信用交換平台，讓眾多借貸平台共同維護並分享一份信用資料，成為一個不做徵信的替代方案。

同時利用區塊鏈去中心化、不可篡改的特性，使平台上的資料更具公信力。

## 使用
### 需求
npm

### 直接執行
1.  獲取檔案
```
git clone https://github.com/cychien/dapp-credit-exchange.git
```
2.  安裝相依模組
```
cd dapp-credit-exchange
npm install
```
3.  安裝truffle至global環境
```
npm install truffle -g
```
4.  進入truffle開發模式，並架設truffle的測試鏈
```
truffle develop
```
5.  部署智能合約
```
migrate
```
6.  打開另一個console，並執行
```
npm start
```

### 修改智能合約
若要修改智能合約，請至contracts/CreditExchange.sol修改

1.  修改後的智能合約必須重新部署，一樣先進入truffle開發模式
```
truffle develop
```
2.  接著直接輸入
```
compile //編譯.sol檔
migrate //部署到現有的鏈上
```

### 修改web程式
若要修改web部分，請至src修改
webpack會在有修改出現時自動重新打包

### 發布
1.  尋找合適的方法搭建POA chain(如：[parity](https://github.com/paritytech/parity/wiki/Demo-PoA-tutorial)、[Clique](https://medium.com/taipei-ethereum-meetup/%E4%BD%BF%E7%94%A8-go-ethereum-1-6-clique-poa-consensus-%E5%BB%BA%E7%AB%8B-private-chain-1-4d359f28feff))，關於為何要用POA chain請參閱[wiki](https://github.com/cychien/dapp-credit-exchange/wiki)
2.  修改truffle.js裡的port參數，改成那條鏈的JSON RPC API port

