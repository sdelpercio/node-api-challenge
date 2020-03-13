import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const CardContainer = styled.div`
	width: 90%;
	margin: 30px auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
`;
const Card = styled.div`
	width: 30%;
	padding: 15px;
	border: 1px solid white;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
`;

const Projects = () => {
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		axios
			.get('http://localhost:5000/api/projects')
			.then(res => {
				console.log('here is res', res);
				setProjects(res.data);
			})
			.catch(err => {
				console.log('here is err', err);
			});
	}, []);

	if (projects.length === 0) {
		return <h3>Add some projects dude</h3>;
	}

	return (
		<div>
			<p style={{ textAlign: 'center' }}>some projectsss</p>
			<CardContainer>
				{projects.map((item, index) => (
					<Card key={index}>
						<h3>Name: {item.name}</h3>
						<p>Description: {item.description}</p>
						<h4>
							Completed:{' '}
							{item.completed ? <span>True</span> : <span>False</span>}
						</h4>
					</Card>
				))}
			</CardContainer>
		</div>
	);
};
export default Projects;
