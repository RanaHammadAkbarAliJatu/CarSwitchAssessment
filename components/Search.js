import React from 'react';
import axios from 'axios';
import { TextInput, View, Text } from 'react-native';

class Search extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			query: '',
			results: [],
			loading: false,
		};

		this.cancel = '';
	}
	fetchSearchResults = (query) => {
		const searchUrl = `https://demo.dataverse.org/api/search?q=${query}`;
		if (this.cancel) {
			this.cancel.cancel();
		}
		this.cancel = axios.CancelToken.source();
		axios.get(searchUrl, {
			cancelToken: this.cancel.token
		})
			.then(res => {
				const { status, data } = res.data
				this.setState({
					results: status == "OK" ? data.items : [],
					loading: false
				})
			})
			.catch(error => {
				if (axios.isCancel(error) || error) {
					this.setState({
						loading: false,
						results: [],
					})
				}
			})
	};

	handleOnInputChange = (query) => {
		if (!query) {
			this.setState({ query, results: []});
		} else {
			this.setState({ query, loading: true}, () => {
				this.fetchSearchResults(query);
			});
		}
	};



	renderSearchResults = () => {
		const { results } = this.state;

		if (results.length) {
			return (
				<View style={{	marginHorizontal: 20}}>
					{results.map((result, index) => {
						return (
							<Text numberOfLines={1} key={index} style={{ color: "gray", marginBottom: 10 }}>{index+1}. {result.name}</Text>
						)
					})}
				</View>
			)
		}
	};

	render() {
		const { query, loading, results } = this.state;
		return (
			<View style={{ flex: 1, width: "100%" }}>
				<TextInput
					style={{
						borderRadius: 22,
						marginTop: 12,
						marginHorizontal: 12,
						backgroundColor: 'white',
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.8,
						shadowRadius: 2,
						elevation: 5,
						color: "black",
						paddingHorizontal: 30,
					}}
					value={query}
					placeholderTextColor="gray"
					onChangeText={this.handleOnInputChange}
					placeholder="Enter text to search"
				/>
				<Text style={{ textAlign: 'center', color: "gray" }}>{loading ? "loading..." : ""}</Text>
				{this.renderSearchResults()}
			</View>
		)
	}
}

export default Search
