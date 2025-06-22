// I USED REMIX IDE FOR THE SMART CONTRACT/ SOLIDITARY
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockPass {
    uint public ticketCount;
    mapping(uint => Ticket) public tickets;

    struct Ticket {
        uint id;
        address owner;
    }

    event TicketMinted(uint indexed id, address indexed owner);

    function mintTicket() public returns (uint) {
        ticketCount++;
        tickets[ticketCount] = Ticket(ticketCount, msg.sender);
        emit TicketMinted(ticketCount, msg.sender);
        return ticketCount;
    }

    function verifyTicket(uint ticketId) public view returns (bool) {
        return tickets[ticketId].owner == msg.sender;
    }
}



