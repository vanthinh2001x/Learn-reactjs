import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Paper, makeStyles, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import productApi from 'api/productApi';
import { useState } from 'react';
import { Pagination, Skeleton } from '@material-ui/lab';
import ProductSkeletonList from 'features/Products/components/ProductSkeletonList';
import ProductList from 'features/Products/components/ProductList';
import ProductSort from 'features/Products/components/ProductSort';
import ProductFilters from 'features/Products/components/ProductFilters';
import FilterViewer from 'features/Products/components/FilterViewer';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useMemo } from 'react';

ListPage.propTypes = {};

const useStyles = makeStyles((theme) => ({
    root: {},
    left: {
        width: '250px',
    },
    right: {
        flex: '1 1 0',
    },
}));

function ListPage(props) {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const queryParams = useMemo(() => {
        const params = queryString.parse(location.search);
        console.log(params);
        return {
            ...params,
            _page: Number.parseInt(params._page) || 1,
            _limit: Number.parseInt(params._limit) || 9,
            _sort: params._sort || 'salePrice:ASC',
            isPromotion: params.isPromotion === 'true',
            isFreeShip: params.isFreeShip === 'true',
        };
    }, [location.search]);
    const [productList, setProductList] = useState([]);
    const [pagination, setPagination] = useState({
        limit: 9,
        total: 10,
        page: 1,
    });
    const [loading, setLoading] = useState(true);
    // const [filters, setFilters] = useState({
    //     _page: 1,
    //     _limit: 9,
    //     _sort: 'salePrice:ASC',
    // });
    // const [filters, setFilters] = useState(() => ({
    //     ...queryParams,
    //     _page: Number.parseInt(queryParams._page) || 1,
    //     _limit: Number.parseInt(queryParams._limit) || 9,
    //     _sort: queryParams._sort || 'salePrice:ASC',
    // }));

    // useEffect(() => {
    //     history.push({
    //         pathname: history.location.pathname,
    //         search: queryString.stringify(filters),
    //     });
    // }, [history, filters]);
    useEffect(() => {
        (async () => {
            try {
                const { data, pagination } = await productApi.getAll(queryParams);
                setProductList(data);
                setPagination(pagination);
                console.log(data);
            } catch (error) {
                console.log('failed to fetch product list: ', error);
            }
            setLoading(false);
        })();
    }, [queryParams]);
    const handlePaginationClick = (e, page) => {
        // setFilters((prevFilter) => ({
        //     ...prevFilter,
        //     _page: page,
        // }));

        const filters = {
            ...queryParams,
            _page: page,
        };
        history.push({
            pathname: history.location.pathname,
            search: queryString.stringify(filters),
        });
    };
    const handleSortChange = (newValue) => {
        // setFilters((prevFilter) => ({
        //     ...prevFilter,
        //     _sort: newValue,
        // }));
        const filters = {
            ...queryParams,
            _sort: newValue,
        };
        history.push({
            pathname: history.location.pathname,
            search: queryString.stringify(filters),
        });
    };
    const handleFiltersChange = (newFilters) => {
        // setFilters((prevFilter) => ({
        //     ...prevFilter,
        //     ...newFilters,
        // }));

        const filters = {
            ...queryParams,
            ...newFilters,
        };
        history.push({
            pathname: history.location.pathname,
            search: queryString.stringify(filters),
        });
    };

    const setNewFilters = (newFilters) => {
        // setFilters(newFilters);
        history.push({
            pathname: history.location.pathname,
            search: queryString.stringify(newFilters),
        });
    };
    return (
        <Box>
            <Container>
                <Grid container spacing={1}>
                    <Grid item className={classes.left}>
                        <Paper elevation={0}>
                            <ProductFilters filters={queryParams} onChange={handleFiltersChange} />
                        </Paper>
                    </Grid>
                    <Grid item className={classes.right}>
                        <Paper elevation={0}>
                            <ProductSort
                                currentSort={queryParams._sort}
                                onChange={handleSortChange}
                            />
                            <FilterViewer filters={queryParams} onChange={setNewFilters} />
                            {loading ? (
                                <ProductSkeletonList length={9} />
                            ) : (
                                <ProductList data={productList} />
                            )}
                            <Pagination
                                count={Math.ceil(pagination.total / pagination.limit)}
                                page={pagination.page}
                                color="primary"
                                onChange={handlePaginationClick}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default ListPage;
