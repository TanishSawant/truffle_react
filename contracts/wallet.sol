pragma solidity >=0.4.21 <0.7.0;

contract wallet{
    address payable public owner;
    bool public paused;
    constructor() public{
        owner = msg.sender;
    }
    struct Payment{
        uint amt;
        uint timestamp;
    }
    
    struct Balance{
        uint total;
        uint numpay;
        mapping(uint => Payment) payments;
    }
    
    mapping(address => Balance) public balance_record;
    
    modifier onlyOwner(){
        require(msg.sender == owner, "You are not owner");
        _;
    }
    
    modifier withoutPaused() {
        require(paused == false, "Contract is paused");
        _;
    }
    
    function change(bool ch) public onlyOwner{
        paused =ch;
    }
    
    function sendMoney() public payable withoutPaused{
        balance_record[msg.sender].total += msg.value;
        balance_record[msg.sender].numpay += 1;
        Payment memory pay = Payment(msg.value, now);
        balance_record[msg.sender].payments[balance_record[msg.sender].numpay] = pay;
    }
    function getBal() public view returns(uint) {
        return balance_record[msg.sender].total;
    }
    function convert(uint _amt) public pure returns(uint) {
        return _amt/1 ether;
    }
    function withdraw(uint _amt) public withoutPaused{
        require(balance_record[msg.sender].total > _amt, "Not enough funds");
        balance_record[msg.sender].total -= _amt;
        msg.sender.transfer(_amt);
    }
    
    function destroy(address payable ender) public onlyOwner{
        selfdestruct(ender);
    }
}