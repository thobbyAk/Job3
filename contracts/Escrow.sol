//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Escrow {
    IERC20 public _token;

    constructor(address ERC20Address) {
        _token = IERC20(ERC20Address);
    }

    uint256 depositCount = 0;
    struct EscrowItem {
        uint256 escrowId;
        address payable creator;
        uint256 amount;
        bytes32 txnHash;
        address payable claimer;
        bool executed;
    }

    mapping(bytes32 => uint256) balances;
    //mapping each Escrow to an Id
    mapping(uint256 => EscrowItem) private idToEscrowItem;

    //event to be emitted when a escrowId is created
    event EscrowItemCreated(
        uint256 indexed escrowId,
        bytes32 indexed txnHash,
        address payable creator,
        address payable claimer,
        uint256 amount,
        bool excecuted
    );

    function getHash(uint256 amount) public view returns (bytes32 result) {
        return keccak256(abi.encodePacked(msg.sender, depositCount, amount));
    }

    function withdrawalEscrow(bytes32 trx_hash, uint256 escrowId) external {
        require(trx_hash[0] != 0, "Transaction hash cannot be empty!");
        require(
            balances[trx_hash] != 0,
            "Escrow with transaction hash doesn't exist."
        );
        require(
            _token.transfer(msg.sender, balances[trx_hash]),
            "Escrow retrieval failed!"
        );

        balances[trx_hash] = 0;
        idToEscrowItem[escrowId].claimer = payable(msg.sender);
        idToEscrowItem[escrowId].executed = true;
    }

    function createEscrow(bytes32 trx_hash, uint256 amount) external payable {
        require(trx_hash[0] != 0, "Transaction hash cannot be empty!");
        require(amount != 0, "Escrow amount cannot be equal to 0.");

        require(
            balances[trx_hash] == 0,
            "Unique hash conflict, hash is already in use."
        );
        require(
            _token.transferFrom(msg.sender, address(this), amount),
            "Transfer to escrow failed!"
        );
        balances[trx_hash] = amount;
        depositCount++;
        // uint256 newItemId = depositCount++;

        idToEscrowItem[depositCount] = EscrowItem(
            depositCount,
            payable(msg.sender),
            amount,
            trx_hash,
            payable(address(0)),
            false
        );
        emit EscrowItemCreated(
            depositCount,
            trx_hash,
            payable(msg.sender),
            payable(address(0)),
            amount,
            false
        );
    }

    function fetchEscrows() external view returns (EscrowItem[] memory) {
        uint256 totalDeposit = depositCount;
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalDeposit; i++) {
            if (idToEscrowItem[i + 1].creator == msg.sender) {
                itemCount += 1;
            }
        }
        EscrowItem[] memory escrow = new EscrowItem[](itemCount);
        for (uint256 i; i < totalDeposit; i++) {
            if (idToEscrowItem[i + 1].creator == msg.sender) {
                uint256 currentId = idToEscrowItem[i + 1].escrowId;
                EscrowItem storage currentItem = idToEscrowItem[currentId];
                escrow[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return escrow;
    }
}
