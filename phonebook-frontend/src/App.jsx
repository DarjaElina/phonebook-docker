import { useEffect, useState } from 'react';

import personService from './services/persons';

import './index.css';

const Notification = ({ message }) => {
    if (message === null) {
        return null;
    }

    const className = message.includes('removed') ? 'errorMessage' : 'successMessage';

    return (
        <div className={className}>
            {message}
        </div>
    )
}

const Filter = ({ handleInputChange }) => {
    return (
        <div>filter shown with <input name='filter' onChange={handleInputChange}/></div>
    )
}

const PersonForm = ({ addNewPerson, handleInputChange, newName, newNumber}) => {

    return (
        <form onSubmit={addNewPerson}>
            <div>
                name: <input name='name' value={newName} onChange={handleInputChange}/>
            </div>
            <div>
                number: <input name='number' value={newNumber} onChange={handleInputChange}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const Persons = ({ filteredPersons, onDeletePerson }) => {
    return (
        <ul>
            {filteredPersons.map(person =>
                <li key={person.id}>
                    {person.name} {person.number}
                    <button onClick={() => onDeletePerson(person.id, person.name)}>delete</button>
                </li>
            )}
        </ul>
    )
}

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [notificationMessage, setNotificationMessage] = useState(null);

    useEffect(() => {
        personService
            .getAll()
            .then(personObj => setPersons(personObj))
    }, [])

    
    const addNewPerson = (e) => {
        e.preventDefault();
        const personObj = {
            name: newName,
            number: newNumber,
        }

    

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
        if (existingPerson?.number === newNumber) {
            alert(`${newName} is already added to phonebook`);
        } else if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
            updateNumber(existingPerson.id, personObj);
        }
   } else {
        personService
            .add(personObj)
            .then(newPersonObj => {
                setNotificationMessage(
                    `Added ${newName}`
                )
                setTimeout(() => {
                    setNotificationMessage(null);
                }, 5000)
                setPersons(persons.concat(newPersonObj));
                setNewName('');
                setNewNumber('');
            })
            .catch(error => console.log('something went wrong...', error))
        }
    }

    const handleInputChange = (e) => {
        switch (e.target.name) {
            case 'name':
                setNewName(e.target.value);
                break;
            case 'number':
                setNewNumber(e.target.value);
                break;
            case 'filter':
                setFilter(e.target.value);
                break;
            default:
                break;
        }
    
    }

    const updateNumber = (id, person) => {

        personService
            .update(id, person)
            .then((updatedPerson) => {
                const updatedPersons = persons.map(person => {
                    return person.id === id ? {...person, number: updatedPerson.number} : person
                })
                setPersons(updatedPersons);
            })
            .catch(error => 
                {setNotificationMessage(
                    `Information of ${person.name} has already been removed from server`
                )
                setTimeout(() => {
                    setNotificationMessage(null);
                }, 5000)}
            )
    }

    const handleDeletePerson = (id, name) => {

        if (window.confirm(`Delete ${name}?`)) {
            personService
                .deletePerson(id)
                .then(personObj => {
                    setPersons(persons.filter(person => person.id !== personObj.id))
                })
                .catch(error => console.log('something went wrong...', error))
        }
    }

    const filteredPersons = filter.length === 0 ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div>
        <h2>Phonebook</h2>
        <Notification message={notificationMessage}/>
        <Filter handleInputChange={handleInputChange}/>
        <h2>Add a new</h2>
        <PersonForm addNewPerson={addNewPerson}
                    newName={newName}
                    newNumber={newNumber}
                    handleInputChange={handleInputChange}/>
        <h2>Numbers</h2>
        <Persons onDeletePerson={handleDeletePerson} filteredPersons={filteredPersons}/>
        </div>
    )
}

export default App;
