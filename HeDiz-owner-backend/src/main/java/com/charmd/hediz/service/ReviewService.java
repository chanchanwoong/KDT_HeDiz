package com.charmd.hediz.service;

import com.charmd.hediz.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {
    public List<ReviewDTO> reviewFindAll(int shopSeq);

    public ReviewDTO reviewFind(int review_seq);

    public int reviewUpdate(ReviewDTO reviewData);

    public int reviewDelete(int review_seq);
}
