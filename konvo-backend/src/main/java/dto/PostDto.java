package dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class PostDto {
    private Long id;
    private String content;
    //    private String image; // Commented out: media attachments not supported
    //    private String video; // Commented out: media attachments not supported
    private UserDto user;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime createdAt;
    private int totalLikes;
    private int totalReplies;
    private int totalRePosts;
    private boolean isLiked;
    private boolean isReposted;
    private boolean isRepost;
    private PostDto repostFor;

    private List<Long> repostUserid;
    private List<PostDto> replyPosts;

    // AI Prompt: There is an issue with the createdAt timestamp not matching between frontend and backend. Ensure both sides use the same date-time format and time zone. 
}