import React, { Component, createContext } from 'react';

import { AddressBook, ExtendedAddressBook, ExtendedAccount, Network, StoreAccount } from 'v2/types';
import * as service from './AddressBook';

interface ProviderState {
  addressBook: ExtendedAddressBook[];
  readAddressBook(uuid: string): AddressBook;
  createAddressBooks(addressBooksData: AddressBook): void;
  deleteAddressBooks(uuid: string): void;
  updateAddressBooks(uuid: string, addressBooksData: AddressBook): void;
  getContactByAddress(address: string): ExtendedAddressBook | undefined;
  getContactByAddressAndNetwork(address: string, network: Network): ExtendedAddressBook | undefined;
  getContactByAccount(account: ExtendedAccount): ExtendedAddressBook | undefined;
  getAccountLabel(account: StoreAccount | ExtendedAccount): string | undefined;
}

export const AddressBookContext = createContext({} as ProviderState);

export class AddressBookProvider extends Component {
  public readonly state: ProviderState = {
    addressBook: service.readAddressBooks() || [],
    readAddressBook: (uuid: string) => {
      return service.readAddressBook(uuid);
    },
    createAddressBooks: (addressBooksData: AddressBook) => {
      service.createAddressBook(addressBooksData);
      this.getAddressBooks();
    },
    deleteAddressBooks: (uuid: string) => {
      service.deleteAddressBook(uuid);
      this.getAddressBooks();
    },
    updateAddressBooks: (uuid: string, addressBooksData: AddressBook) => {
      service.updateAddressBook(uuid, addressBooksData);
      this.getAddressBooks();
    },
    getContactByAddress: address => {
      const { addressBook } = this.state;
      return addressBook.find(contact => contact.address.toLowerCase() === address.toLowerCase());
    },
    getContactByAddressAndNetwork: (address, network) => {
      const { addressBook } = this.state;
      return addressBook
        .filter(contact => contact.network === network.name)
        .find(contact => contact.address.toLowerCase() === address.toLowerCase());
    },
    getContactByAccount: account => {
      const { addressBook } = this.state;
      return addressBook
        .filter(contact => contact.network === account.networkId)
        .find(contact => contact.address.toLowerCase() === account.address.toLowerCase());
    },
    getAccountLabel: account => {
      const addressContact = this.state.getContactByAccount(account as ExtendedAccount);
      return addressContact ? addressContact.label : undefined;
    }
  };

  public render() {
    const { children } = this.props;
    return <AddressBookContext.Provider value={this.state}>{children}</AddressBookContext.Provider>;
  }

  private getAddressBooks = () => {
    const addressBook: ExtendedAddressBook[] = service.readAddressBooks() || [];
    this.setState({ addressBook });
  };
}
