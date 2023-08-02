import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import axiosClient from '../config/axiosClient';

interface Company {
  id: number;
  name: string;
}

const UserProfile: React.FC = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      };
      
      try {
        const response = await axiosClient.get('/companies', config);
        console.log(`Fetch Companies Response: ${JSON.stringify(response.data)}`);
        setCompanies(response.data);
      } catch (error) {
        console.error(`Error fetching companies: ${error.message}`);
        if (error.response) {
          console.error(`Response status: ${error.response.status}`);
          console.error(`Response data: ${JSON.stringify(error.response.data)}`);
        }
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`handleChange called with name: ${event.target.name}, value: ${event.target.value}`);
    setAuth({
      ...auth,
      [event.target.name]: event.target.value,
    });
  };

  const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(`handleCompanyChange called with value: ${event.target.value}`);
    setSelectedCompanyId(Number(event.target.value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`handleSubmit called with github_user: ${auth.github_user}, selectedCompanyId: ${selectedCompanyId}`);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    };

    try {
      const response = await axiosClient.put(`/${auth.github_user}`, { company_id: selectedCompanyId }, config);
      console.log(`Update Profile Response: ${JSON.stringify(response.data)}`);
      setAuth(response.data);
    } catch (error) {
      console.error(`Error updating profile: ${error.message}`);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={auth.username} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={auth.email} onChange={handleChange} />
        </label>
        <label>
          Github User:
          <input type="text" name="github_user" value={auth.github_user} onChange={handleChange} />
        </label>
        <label>
          Company:
          <select value={selectedCompanyId ?? ''} onChange={handleCompanyChange}>
            <option value="">Select company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
