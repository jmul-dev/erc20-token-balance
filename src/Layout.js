import styled from "styled-components";

export const Wrapper = styled.div`
	padding: 30px;
`;

export const TableWrapper = styled.div`
	display: table;
	height: 90vh;
`;

export const TableCell = styled.div`
	display: table-cell;
	text-align: center;
	vertical-align: middle;
`;

export const Title = styled.div`
	font-size: 42px;
	font-weight: bold;
`;

export const Description = styled.div`
	font-size: 16px;
	margin-top: 10px;
`;

export const WalletWrapper = styled.div`
	margin-top: 20px;
`;

export const Wallet = styled.span`
	font-weight: bold;
`;

export const TokenWrapper = styled.div`
	height: 90vh;
	margin-top: 20px;
	overflow-y: scroll;
	overflow-x: hidden;
`;

export const Header = styled.div`
	font-size: 20px;
	font-weight: bold;
`;

export const HeaderSmall = styled.div`
	font-size: 12px;
	font-weight: normal;
`;

export const TokenRow = styled.div`
	padding: 10px 0px;
`;

export const A = styled.a`
	text-decoration: none;
	color: #eeeeee;
	&:hover {
		text-decoration: none;
		color: #bbbbbb;
	}
`;

export const TokenImage = styled.img`
	width: 20px;
`;

export const TokenName = styled.span`
	margin-left: 10px;
`;

export const TokenSymbol = styled.span`
	margin-left: 5px;
`;

export const TokenBalance = styled.span``;
