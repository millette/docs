---
icon: zhinengsuanfa
---
# Algorithms

Gorse has implemented various types of recommendation algorithms, both non-personalized and personalized. These recommendation algorithms are building blocks compose the recommendation workflow.

## Non-personalized Algorithms

### Latest Items

Showing the latest items to users according to timestamps allows a new item to be exposed to users in time. To enable the latest recommender in Gorse, you need to set timestamp information for the items. Without timestamps, Gorse will not generate a list of the latest items.

### Popular Items

Many websites shows the recent popular items to users such as Twitter trending. In Gorse, the `popular_window` in the configuration file corresponds to the window of popular items, the following example is to recommend popular items within one year (a bit too long).

```toml
[recommend.popular]

popular_window = "4320h"
```

## Similarity Algorithms

In some scenarios, users like specific types of items, for example, gamers like to solve puzzles or users of a video platform like to watch dancing girls. Based on the user's history and the similarity between items, the item-based similarity recommendation algorithm works as follows: 

1. Calculate the similarity between items.
2. Recommend items with maximal similarity to user's history.

### Item Similarity

Gorse calculates item similarity in three modes, which can be set in the configuration file.

- **Similarity:** Calculates similarity based on label overlap between items.
- **Related:** Calculates similarity based on user overlap between items.
- **Automatic:** Prefer to use labels to calculate similarity, if there are no labels then use users to calculate similarity.

```toml
[recommend.item_neighbors]

# The type of neighbors for items. There are three types:
#   similar: Neighbors are found by number of common labels.
#   related: Neighbors are found by number of common users.
#   auto: If a item have labels, neighbors are found by number of common labels.
#         If this item have no labels, neighbors are found by number of common users.
# The default value is "auto".
neighbor_type = "similar"
```

It is recommended to choose `similar` or `auto` because item-based similarity recommender using `related` recommends similarly to collaborative filtering recommenders. The advantage of item-based similarity (labels-based) recommender is that it can quickly recommend a new item to users who are interested in such items based on the labels. Of course, this recommender requires accurate labels for the items, and invalid labels are counterproductive.

### Item-based Similarity Recommendation

### User Similarity and Recommendation

There are also common preferences among similar users. For example, students majoring in computer science usually buy books about computer science, and elders like to buy health care products.

Gorse calculates the similarity between users in three modes, which can be set in the configuration file.

- **Similarity:** Calculates similarity based on label overlap between users.
- **Related:** Calculates similarity based on historical item overlap between users.
- **Automatic:** Prioritizes the use of user labels, if there are no labels then the similarity is calculated using historical items.

```toml
[recommend.user_neighbors]

# The type of neighbors for users. There are three types:
#   similar: Neighbors are found by number of common labels.
#   related: Neighbors are found by number of common liked items.
#   auto: If a user have labels, neighbors are found by number of common labels.
#         If this user have no labels, neighbors are found by number of common liked items.
# The default value is "auto".
neighbor_type = "similar"
```

It is recommended to choose `similar` or `auto` because user-based Similarity Recommender using `related` is similar to collaborative filtering recommender. The recommender is friendly to new users. With user labels, recommendations can be generated based on similar users' preferences even if the user does not have any history.

## Model-based Algorithms

### Collaborative Filtering

Recommenders based on similar items and similar users require that the recommended items need to be linked with similar users or historical items of the recommended user, which limits the scope of recommended items searching. The collaborative filtering recommender in Gorse uses matrix factorization[^1][^2] to recommend items. The training algorithm maps users and items to embedding vectors in a high-dimensional space, and the user's preference for an item is the dot product of the user embedding vector and the item embedding vector. However, the disadvantage of collaborative filtering recommender is that it cannot utilize the label information of users and items, and it cannot handle new users and new items.

### Click-through Rate Prediction

Is there a recommender that combines the advantages of similarity recommender and collaborative filtering recommender? Then it is the click-through rate, prediction model. The click-through rate prediction model in Gorse is a factorization machine[^3] that generates embedding vectors for each user label and item label in addition to embedding vectors for each user and item. Although the factorization machine model is effective, it is not generally used as a recommender for collecting recommended items over all items. Compared with collaborative filtering recommender and similarity recommender, its computational complexity is large. Gorse's click-through prediction model is used to fuse and rank the results of the above recommenders.

The original meaning of "click-through rate prediction" is to predict the probability that users will click on the recommended content or ads, but it should be noted that the click-through rate prediction in Gorse refers more to the probability that users will give positive feedback to the recommended results. For example, suppose we set in Gorse that positive feedback means the user has watched 50% of the video, then the "click-through rate" is the probability that the user has watched more than 50% of the video.

[^1]: Rendle, Steffen, et al. "BPR: Bayesian personalized ranking from implicit feedback." Proceedings of the Twenty-Fifth Conference on Uncertainty in Artificial Intelligence. 2009.

[^2]: He, Xiangnan, et al. "Fast matrix factorization for online recommendation with implicit feedback." Proceedings of the 39th International ACM SIGIR conference on Research and Development in Information Retrieval. 2016.

[^3]: Rendle, Steffen. "Factorization machines." 2010 IEEE International conference on data mining. IEEE, 2010.
