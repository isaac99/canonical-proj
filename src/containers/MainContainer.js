/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import axios from "axios";
import _ from 'lodash';
import { Card } from '@canonical/react-components';



const MainContainer = () => {
    const baseURL = 'https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json';
    const [posts, setPosts] = useState(false);

    useEffect(() => {
        axios.get(baseURL).then((response) => {
            const tempPosts = response.data.map((element) => {
               
                //get date and format properly
                let date = new Date(element.date).toDateString().split(' ').slice(1);
                date = date[1] + ' ' + date[0] + ' ' + date[2];

                //flatten array of groups, categories, etc.. associated with post
                let wp_terms = _.flatten(element['_embedded']['wp:term']);

                //get name for header and footer by searching for associated category/group
                let item_category = _.filter(wp_terms, (item) => {
                    if (item.id === element.group[0]) {
                        return true;
                    }
                });
                let item_category_footer = _.filter(wp_terms, (item) => {
                    if (item.id === element.categories[0]) {
                        return true;
                    }
                });
                
                //grab items correctly
                item_category = item_category[0]?.name;
                item_category_footer = item_category_footer[0]?.name;

                return {
                    'title_category': item_category,
                    'author': element['_embedded'].author[0].name,
                    'main_image': element.featured_media,
                    'created_date': date,
                    'card_thumb_content': element.title.rendered,
                    'item_category_footer': item_category_footer
                }
            });
            setPosts(tempPosts);
        }).catch((err)=>{
            console.log(err);
        });
    }, []);
 
  return (
    <div className='row'>
        {
            posts &&
            posts.map((post, index) => {
                return  (
                    <Card key={index} className="col-4 blog-card" highlighted={true}>
                        <h4 className='p-muted-heading card-header'>{post.title_category} &nbsp;</h4>
                        <hr className='u-sv1'></hr>
                        <img className='p-card__image' src={post.main_image}></img>
                        <p dangerouslySetInnerHTML={{__html: post.card_text_content}}></p>
                        <p className='thumb-blurb p-heading--3'>{post.card_thumb_content}</p>
                        <div className='u-no-padding--bottom'>
                            <p className='author-area'>By <a href={window.location}>{post.author}</a> on {post.created_date}</p>
                            <hr className='u-sv1'></hr>
                            <p className='left-card-foot'>{post.item_category_footer}</p>
                        </div>
                    </Card>
                );
            })
        }
    </div>
  );
};

export default MainContainer;
