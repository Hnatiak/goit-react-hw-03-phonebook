import { Component } from 'react';
import { nanoid } from 'nanoid';
import { Report } from 'notiflix/build/notiflix-report-aio';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import Filter from './Filter';
import Message from './Message';
import contacts from '../../contacts.json';
import css from './App.module.css';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');

    if (savedContacts !== null) {
      this.setState({ contacts: JSON.parse(savedContacts) });
      return;
    }

    this.setState({ contacts: contacts });
  }

  componentDidUpdate(_, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  addContact = ({ name, number }) => {
    const { contacts } = this.state;
    const newContact = { id: nanoid(), name, number };

    contacts.some(contact => contact.name === name)
      ? Report.warning(
          `${name}`,
          'This user is already in the contact list.',
          'OK'
        )
      : this.setState(({ contacts }) => ({
          contacts: [newContact, ...contacts],
        }));
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  filtredContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilter)
    );
  };

  render() {
    const { filter } = this.state;
    const addContact = this.addContact;
    const changeFilter = this.changeFilter;
    const filtredContacts = this.filtredContacts();
    const deleteContact = this.deleteContact;
    const length = this.state.contacts.length;

    return (
      <div className={css.container}>
        <h1 className={css.title}>
          Phone<span className={css.title__color}>book</span>
        </h1>
        <ContactForm onSubmit={addContact} />

        <h2 className={css.subtitle}>Contacts</h2>
        <Filter filter={filter} changeFilter={changeFilter} />
        {length > 0 ? (
          <ContactList
            contacts={filtredContacts}
            onDeleteContact={deleteContact}
          />
        ) : (
          <Message text="Contact list is empty." />
        )}
      </div>
    );
  }
}