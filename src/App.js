import React, { useState, useEffect } from "react";
import data from "./data/data.json";
import "./App.css"

const App = () => {
  const [people, setPeople] = useState(data);
  const [form, setForm] = useState({
    Name: "",
    Surname: "",
    Age: "",
    Gender: true,
    Color: ""
  });
  
  const uniqueColors = [...new Set(data.map(person => person.Color))];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "radio" ? value === "true" : value
    });
  };

  const handleSubmit = async () => {
    if (form.Name && form.Surname && form.Age && form.Color) {
      const newPerson = { ...form, Index: people.length };
      setPeople([...people, newPerson]);
      setForm({ Name: "", Surname: "", Age: "", Gender: true, Color: "" });

      try {
        const response = await fetch("./data/data.json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([...people, newPerson])
        });
        if (!response.ok) {
          throw new Error("Błąd zapisu do pliku JSON");
        }
      } catch (error) {
        console.error("Błąd zapisu:", error);
      }
    }
  };

  const getInitials = () => {
    const nameCounts = {};
    const surnameCounts = {};
    
    people.forEach(({ Name, Surname }) => {
      const firstLetterName = Name.charAt(0).toUpperCase();
      const firstLetterSurname = Surname.charAt(0).toUpperCase();
      
      nameCounts[firstLetterName] = (nameCounts[firstLetterName] || 0) + 1;
      surnameCounts[firstLetterSurname] = (surnameCounts[firstLetterSurname] || 0) + 1;
    });
    
    const mostCommonName = Object.keys(nameCounts).reduce((a, b) => nameCounts[a] > nameCounts[b] ? a : b, "");
    const mostCommonSurname = Object.keys(surnameCounts).reduce((a, b) => surnameCounts[a] > surnameCounts[b] ? a : b, "");
    
    return `${mostCommonName}${mostCommonSurname}`;
  };

  return (
    <div className="container">
      <h1>Lista osób</h1>
      <p className="initials">Inicjały dnia: {getInitials()}</p>
      <table className="table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Wiek</th>
            <th>Płeć</th>
            <th>Kolor</th>
          </tr>
        </thead>
        <tbody>
          {people.map(({ Index, Name, Surname, Age, Gender, Color }) => (
            <tr key={Index}>
              <td>{Index}</td>
              <td>{Name}</td>
              <td>{Surname}</td>
              <td>{Age}</td>
              <td>{Gender ? "Mężczyzna" : "Kobieta"}</td>
              <td>{Color}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Dodaj osobę</h2>
      <div className="form">
        <input name="Name" placeholder="Imię" value={form.Name} onChange={handleChange} />
        <input name="Surname" placeholder="Nazwisko" value={form.Surname} onChange={handleChange} />
        <input name="Age" placeholder="Wiek" type="number" value={form.Age} onChange={handleChange} />
        <div className="gender">
          <label>
            <input type="radio" name="Gender" value={true} checked={form.Gender === true} onChange={handleChange} /> Mężczyzna
          </label>
          <label>
            <input type="radio" name="Gender" value={false} checked={form.Gender === false} onChange={handleChange} /> Kobieta
          </label>
        </div>
        <select name="Color" value={form.Color} onChange={handleChange}>
          <option value="">Wybierz kolor</option>
          {uniqueColors.map((color, index) => (
            <option key={index} value={color}>{color}</option>
          ))}
        </select>
        <button className="button" onClick={handleSubmit}>Dodaj</button>
      </div>
    </div>
  );
};

export default App;
